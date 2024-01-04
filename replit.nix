{ pkgs }: {
    deps = [
      pkgs.vite
        pkgs.nodejs-16_x
        pkgs.pm2
        pkgs.cowsay
    ];
}