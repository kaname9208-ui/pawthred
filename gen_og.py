from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
bg = (237, 230, 218)        # warm cream
ink = (31, 27, 22)          # near-black
muted = (120, 110, 98)      # warm gray
accent = (184, 142, 102)    # thread brown

img = Image.new("RGB", (W, H), bg)
d = ImageDraw.Draw(img)

# soft accent circle (thread spool motif), off to the right
d.ellipse([820, 120, 1080, 380], fill=accent)
d.ellipse([860, 160, 1040, 340], fill=bg)
d.ellipse([905, 205, 995, 295], fill=accent)

# brand name
brand = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 96)
tag = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 34)
sub = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)

d.text((90, 210), "Paw & Thread", font=brand, fill=ink)
d.text((92, 330), "Turn your pet into something you can wear.", font=tag, fill=muted)
d.text((92, 400), "CUSTOM PET EMBROIDERED APPAREL", font=sub, fill=accent)

img.save("public/og.png", "PNG")
print("wrote public/og.png", img.size)
