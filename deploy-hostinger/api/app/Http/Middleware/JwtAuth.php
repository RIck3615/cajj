<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader) {
            return response()->json(['error' => 'Token d\'accès requis'], 401);
        }
        
        $token = str_replace('Bearer ', '', $authHeader);
        
        if (!$token) {
            return response()->json(['error' => 'Token d\'accès requis'], 401);
        }
        
        try {
            $jwtSecret = env('JWT_SECRET', 'cajj-secret-key-change-in-production');
            if (empty($jwtSecret)) {
                Log::error('JWT_SECRET non configuré');
                return response()->json(['error' => 'Configuration serveur invalide'], 500);
            }
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
            $request->merge(['user' => (array) $decoded]);
        } catch (\Firebase\JWT\ExpiredException $e) {
            return response()->json(['error' => 'Token expiré'], 403);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            return response()->json(['error' => 'Token invalide'], 403);
        } catch (\Exception $e) {
            Log::error('Erreur JWT: ' . $e->getMessage());
            return response()->json(['error' => 'Token invalide ou expiré', 'details' => $e->getMessage()], 403);
        }
        
        return $next($request);
    }
}
