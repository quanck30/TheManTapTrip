<?php
/**
 * @author DINH BINH QUAN
 * 2026/06/05
 */
namespace App\Contracts;

use App\DTO\SocialUserDto;

interface SocialProviderInterface{
    public function name():string;

    public function getUser(string $accessToken):SocialUserDto;
}
