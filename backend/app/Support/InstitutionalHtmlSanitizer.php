<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class InstitutionalHtmlSanitizer
{
    public function sanitize(?string $content): ?string
    {
        if (blank($content)) {
            return $content;
        }

        $config = (new HtmlSanitizerConfig)
            ->allowSafeElements()
            ->allowRelativeLinks()
            ->allowRelativeMedias()
            ->forceHttpsUrls();

        return (new HtmlSanitizer($config))->sanitize($content);
    }
}
