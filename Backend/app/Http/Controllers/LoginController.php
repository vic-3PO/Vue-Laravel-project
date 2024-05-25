<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\LoginNeedsVerfication;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class LoginController extends Controller
{
    use HasApiTokens, Notifiable;
    public function submit(Request $request)
    {
        // Validar o e-mail
        $request->validate([
            'email' => 'required|email'
        ]);

        // Encontrar ou criar um modelo de usuário
        $user = User::firstOrCreate([
            'email' => $request->email
        ]);

        // Enviar o e-mail de verificação
        $user->notify(new LoginNeedsVerfication());

        // Retornar uma resposta
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

            
            //return response()->json(['message' => 'Autenticação bem-sucedida.']);
            return $user->createToken($request->login_code)->plainTextToken;
        }

        // se não, retornar uma mensagem de erro
        return response()->json(['message' => 'Codigo de verificacao invalido.'], 401);
    }

    public function getLoginCode(Request $request)
{
    // Validar o e-mail
    $request->validate([
        'email' => 'required|email'
    ]);

    // Encontrar o usuário pelo e-mail
    $user = User::where('email', $request->email)->first();

    if ($user && $user->login_code) {
        return response()->json(['login_code' => $user->login_code]);
    }

    return response()->json(['message' => 'Código de login não encontrado.'], 404);
}

}
