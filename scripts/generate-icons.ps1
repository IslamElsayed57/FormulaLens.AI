Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path 'assets/icons' | Out-Null
$src = [System.Drawing.Image]::FromFile((Resolve-Path 'WhatsApp Image 2026-10-26 at 3.02.22 PM.jpeg'))

function Resize-Img($img, $w, $h, $dest) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

Resize-Img $src 192 192 'assets/icons/icon-192.png'
Resize-Img $src 512 512 'assets/icons/icon-512.png'
Resize-Img $src 512 512 'assets/icons/icon-maskable-512.png'
Resize-Img $src 180 180 'assets/icons/apple-touch-icon.png'
Resize-Img $src 64 64 'assets/icons/favicon-64.png'
Resize-Img $src 32 32 'assets/icons/favicon-32.png'
$src.Dispose()
Write-Output "All icons generated successfully!"
