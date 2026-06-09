<?php
/**
 * @author DINH BINH QUAN
 * 2026/06/05
 */
namespace App\DTO;

class SocialUserDto
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public readonly string $providerId,
        public readonly ?string $name,
        public readonly ?string $email,
        public readonly ?string $avatar,
    ) {
        //
    }
}
