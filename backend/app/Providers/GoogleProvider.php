<?php

/**
 * @author DINH BINH QUAN
 * 2026/06/05
 */

namespace App\Providers;

use App\Contracts\SocialProviderInterface;
use App\DTO\SocialUserDto;
use App\Http\Responses\ApiResponse;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Exceptions\DriverMissingConfigurationException;
use Laravel\Socialite\Facades\Socialite;
use Override;
use Throwable;

class GoogleProvider implements SocialProviderInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    #[Override]
    public function name(): string
    {
        return 'google';
    }

    #[Override]
    public function getUser(string $accessToken): SocialUserDto
    {

       // フロントエンドから受け取ったGoogleアクセストークンをSocialiteで検証します。
        /** @var AbstractProvider $provider */
        $provider = Socialite::driver('google');
        $googleUser = $provider->stateless()->userFromToken($accessToken);


        return new SocialUserDto(
            providerId: $googleUser->getId(),
            name: $googleUser->getName(),
            email: $googleUser->getEmail(),
            avatar: $googleUser->getAvatar(),
        );
    }
}
