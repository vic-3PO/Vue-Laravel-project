<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoginNeedsVerification extends Notification
{
    use Queueable;

    protected $loginCode;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->loginCode = rand(111111, 999999);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // Update the login_code in the user's record
        $notifiable->update([
            'login_code' => $this->loginCode
        ]);

        return (new MailMessage)
            ->subject('Your Login Code')
            ->greeting('Hello!')
            ->line("Your login code is {$this->loginCode}.")
            ->line('Please do not share this code with anyone.')
            ->salutation('Regards, Your App Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
