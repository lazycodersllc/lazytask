<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit50b88984578afa30576e88376bf97a3f
{
    public static $prefixLengthsPsr4 = array (
        'F' => 
        array (
            'Firebase\\JWT\\' => 13,
        ),
        'A' => 
        array (
            'App\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Firebase\\JWT\\' => 
        array (
            0 => __DIR__ . '/..' . '/firebase/php-jwt/src',
        ),
        'App\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit50b88984578afa30576e88376bf97a3f::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit50b88984578afa30576e88376bf97a3f::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit50b88984578afa30576e88376bf97a3f::$classMap;

        }, null, ClassLoader::class);
    }
}
