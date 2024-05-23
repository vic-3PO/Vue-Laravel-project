<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\LoginNeedsVerification;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function submit(Request $request)
    {
        // validar o email
        $request->validate([
            'email' => 'required|email'
        ]);

        // encontrar ou criar um modelo de usuário
        $user = User::firstOrCreate([
            'email' => $request->email
        ]);

        if (!$user) {
            return response()->json(['message' => 'Não foi possível processar um usuário com esse endereço de e-mail.'], 401);
        }

        // enviar o usuário um código de uso único
        $user->notify(new LoginNeedsVerification());

        // retornar uma resposta
        return response()->json(['message' => 'Notificação de código de verificação enviada para o seu e-mail.']);
    }

    public function verify(Request $request)
    {
        // validar a solicitação recebida
        $request->validate([
            'email' => 'required|email',
            'login_code' => 'required|numeric|between:111111,999999'
        ]);

        // encontrar o usuário
        $user = User::where('email', $request->email)
            ->where('login_code', $request->login_code)
            ->first();

        // se o código fornecido for o mesmo que o salvo, retornar um token de autenticação
        if ($user) {
            $user->update([
                'login_code' => null
            ]);

            return $user->createToken('authToken')->plainTextToken;
        }

        // se não, retornar uma mensagem de erro
        return response()->json(['message' => 'Código de verificação inválido.'], 401);
    }
}
