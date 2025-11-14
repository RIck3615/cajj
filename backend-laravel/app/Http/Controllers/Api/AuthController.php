<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        
        $username = env('ADMIN_USERNAME', 'admin');
        $password = env('ADMIN_PASSWORD', 'admin123');
        
        if ($request->username === $username && $request->password === $password) {
            $jwtSecret = env('JWT_SECRET', 'cajj-secret-key-change-in-production');
            
            $payload = [
                'username' => $username,
                'iat' => time(),
                'exp' => time() + (24 * 60 * 60), // 24 heures
            ];
            
            $token = JWT::encode($payload, $jwtSecret, 'HS256');
            
            return response()->json([
                'token' => $token,
                'user' => ['username' => $username],
            ]);
        }
        
        return response()->json(['error' => 'Identifiants incorrects'], 401);
    }
}
