/**
 * Welcome to Cloudflare Workers!
 *
 * This is the Backend API for CozyClub
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Configuration
const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*', //  URL Github Pages
	'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// Handle CORS Preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: CORS_HEADERS });
		}

		// Route: POST /register
		if (url.pathname === '/register' && request.method === 'POST') {
			return handleRegister(request, env);
		}

		// Route: POST /login
		if (url.pathname === '/login' && request.method === 'POST') {
			return handleLogin(request, env);
		}

		// Route: Delete
		if (url.pathname === '/user' && request.method === 'DELETE') {
			return handleDeleteUser(request, env);
		}

		// Route: update user nickname
		if (url.pathname === '/user' && request.method === 'PUT') {
  		return handleUpdateUser(request, env);
		}
		
		// Game API
		if (url.pathname === '/game/create' && request.method === 'POST') {
      return handleCreateLobby(request, env);
    }
    if (url.pathname === '/game/join' && request.method === 'POST') {
      return handleJoinLobby(request, env);
    }
    if (url.pathname === '/game/state' && request.method === 'GET') {
      return handleGetGameState(request, env);
    }
		// ...

		// Default Route (404)
		return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
	},
};

// Logic: register
async function handleRegister(request, env) {
	try {
		const { username, password } = await request.json();

		if (!username || !password) {
			return new Response(JSON.stringify({ error: 'Missing username or password' }), {
				status: 400,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		// Hash Password
		const passwordHash = await bcrypt.hash(password, 10);

		// Save to Database (D1)
		// env.DB -> wrangler.toml var
		const result = await env.DB.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').bind(username, passwordHash).run();

		if (result.success) {
			return new Response(JSON.stringify({ message: 'User created successfully!' }), {
				status: 201,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		} else {
			throw new Error('Database insert failed');
		}
	} catch (err) {
		// Exit Username or Database Error
		return new Response(JSON.stringify({ error: 'Register failed. Username might be taken.' }), {
			status: 500,
			headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
		});
	}
}

// Logic: Login
async function handleLogin(request, env) {
	try {
		const { username, password } = await request.json();

		// find User form Database
		const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found' }), {
				status: 401,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		// Compare Hash
		const isValid = await bcrypt.compare(password, user.password_hash);

		if (!isValid) {
			return new Response(JSON.stringify({ error: 'Invalid password' }), {
				status: 401,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		// build JWT Token
		const token = jwt.sign({ id: user.id, username: user.username }, env.JWT_SECRET, { expiresIn: '24h' });

		// send token back (JSON or Set-Cookie)
		// JSON for easy to use in frontend
		return new Response(
			JSON.stringify({
				message: 'Signin successful',
				token: token,
				user: { id: user.id, username: user.username, nickname: user.nickname },
			}),
			{
				status: 200,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			}
		);
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Signin server error' }), {
			status: 500,
			headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
		});
	}
}

// Logics: Delete 
async function handleDeleteUser(request, env) {
	try {
		// get token from header
		const authHeader = request.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer')) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });
		}
		const token = authHeader.split(' ')[1];

		// find user ID
		const payload = jwt.verify(token, env.JWT_SECRET);
		const userId = payload.id;

		// delete from Database
		await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

		return new Response(JSON.stringify({ message: 'User deleted' }), {
			status: 200,
			headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Delete failed' }), {
			status: 500,
			headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
		});
	}
}

// Logics: Update User
async function handleUpdateUser(request, env) {
  try {
    // Check Token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer')) return new Response('Unauthorized', { status: 401 });
    const token = authHeader.split(' ')[1];
    const userId = jwt.verify(token, env.JWT_SECRET).id;

    // recive nickname
    const { nickname } = await request.json();

    // update to Database
    await env.DB.prepare('UPDATE users SET nickname = ? WHERE id = ?')
      .bind(nickname, userId).run();

    // send Data back to update on website
    const updatedUser = await env.DB.prepare('SELECT id, username, nickname FROM users WHERE id = ?')
      .bind(userId).first();

    return new Response(JSON.stringify({ message: 'Profile updated', user: updatedUser }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500, headers: CORS_HEADERS });
  }
}

// Logics: Creat Lobby
async function handleCreateLobby(request, env) {
  try {
    const auth = await authenticate(request, env);	
    const { playerName } = await request.json();	// Get User Nickname
    
    // Random Lobby Code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Save data on lobbies DB
    // (host_id : user.id of host (if alr login)
    await env.DB.prepare('INSERT INTO lobbies (code, host_id) VALUES (?, ?)')
      .bind(roomCode, auth ? auth.id : null).run();

    // Make sure that host is the first on participants DB
    await env.DB.prepare('INSERT INTO participants (lobby_code, user_id, display_name) VALUES (?, ?, ?)')
      .bind(roomCode, auth ? auth.id : null, playerName || (auth ? auth.nickname : 'Host')).run();

    // Game state
    await env.DB.prepare('INSERT INTO riddle_states (lobby_code) VALUES (?)')
      .bind(roomCode).run();

    return new Response(JSON.stringify({ message: 'Lobby created', roomCode }), {
      status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Create failed' }), { status: 500, headers: CORS_HEADERS });
  }
}

// Logics: Join lobby
async function handleJoinLobby(request, env) {
  try {
    const auth = await authenticate(request, env);
    const { roomCode, playerName } = await request.json();

    // Check Exist Lobby and its state
    const lobby = await env.DB.prepare('SELECT * FROM lobbies WHERE code = ?').bind(roomCode).first();
    if (!lobby) return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404, headers: CORS_HEADERS });
    if (lobby.status !== 'waiting') return new Response(JSON.stringify({ error: 'Game already started' }), { status: 400, headers: CORS_HEADERS });

    // Check alr Exist player name
    const nameToCheck = playerName || (auth ? auth.nickname : 'Player');
    const existing = await env.DB.prepare('SELECT * FROM participants WHERE lobby_code = ? AND display_name = ?')
      .bind(roomCode, nameToCheck).first();
    if (existing) return new Response(JSON.stringify({ error: 'Name taken' }), { status: 400, headers: CORS_HEADERS });

    // Add player
    await env.DB.prepare('INSERT INTO participants (lobby_code, user_id, display_name) VALUES (?, ?, ?)')
      .bind(roomCode, auth ? auth.id : null, nameToCheck).run();

    return new Response(JSON.stringify({ message: 'Joined', player: nameToCheck }), {
      status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Join failed' }), { status: 500, headers: CORS_HEADERS });
  }
}

// Logics: Lobby state
async function handleGetGameState(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Get Lobby Data
  const lobby = await env.DB.prepare('SELECT * FROM lobbies WHERE code = ?').bind(code).first();
  if (!lobby) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: CORS_HEADERS });

  // Get player list
  const players = await env.DB.prepare('SELECT display_name, is_ready, (user_id = ?) as is_host FROM participants WHERE lobby_code = ?')
    .bind(lobby.host_id, code).all();

  // Get game state (if alr started)
  const game = await env.DB.prepare('SELECT * FROM riddle_states WHERE lobby_code = ?').bind(code).first();

  return new Response(JSON.stringify({ 
    lobby, 
    players: players.results,
    game
  }), {
    status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
  });
}

// Logics: Helper Check Login
async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET);
    // Get LASTEST nickname DB
    const user = await env.DB.prepare('SELECT id, username, nickname FROM users WHERE id = ?').bind(payload.id).first();
    return user;
  } catch (e) {
    return null;
  }
}