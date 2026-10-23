Open the [image compressor](../image-compress.html). It uses Canvas to re-encode static images in your browser. It does not guarantee a fixed target file size for every image.

## Compare one source image

[Download the transparent PNG fixture](../../img/compression-sample.png). This synthetic 640 × 480 image contains a gradient rectangle and text, with transparent corners. It does not contain personal photos or republished material.

Measured on Windows, Chrome 155.0.8059.82, Canvas encoder, quality 80%. Source PNG: 192201 B, 640 × 480.

image/png, 640 × 480: 192201 B; RGBA(0,0) = 0, 0, 0, 0.

image/jpeg, 640 × 480: 6523 B; RGBA(0,0) = 255, 255, 255, 255.

image/webp, 640 × 480: 4126 B; RGBA(0,0) = 0, 0, 0, 0.

image/webp, 320 × 240: 2062 B; RGBA(0,0) = 0, 0, 0, 0.

Select the fixture, clear both dimension limits and export PNG, JPEG at 80% and WebP at 80%. Then keep WebP at 80% and set the maximum width to 320. Compare the downloaded files and their dimensions, not just the previews.

## What each setting changes

PNG export has no quality parameter. Resize it to reduce its dimensions. JPEG cannot preserve transparency, so the tool fills transparent areas with white. WebP can preserve transparency, but export support depends on the browser. The tool verifies the returned MIME type rather than naming a fallback PNG as WebP.

Dimension limits preserve aspect ratio and do not upscale images. The 640 × 480 fixture should become 320 × 240 when limited to a width of 320. Quality mainly affects lossy JPEG and WebP encoding; byte counts depend on image content and the browser encoder.

## Errors and larger results

An empty selection should prompt you to choose a file. Negative, zero and fractional dimensions are rejected, and failed operations invalidate previous downloads. Damaged or very large files may fail to decode or exceed device memory.

An already optimized image can become larger after re-encoding. The size comparison reports this increase. Check transparency in the PNG/WebP downloads and the white background in JPEG. Processing is static and single-frame; animation, EXIF, color profiles and other metadata are not guaranteed to survive. Upload platforms may encode the result again.
