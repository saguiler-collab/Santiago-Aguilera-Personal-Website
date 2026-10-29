"""Re-cut the headline tiles (assets/photos/hero) and the few photo cards that
need a face-aware crop, from the full-size photos in assets/photos.

Usage: python3 tools/face-crops.py [outdir] [hero|card|<name> ...]
"""
import os, sys
from PIL import Image
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'photos') + '/'
OUT = sys.argv[1] if len(sys.argv) > 1 else ROOT

def crop(src, cx, cy, wf, size, out, fy=0.45, fx=0.5, q=82):
    """Crop a window of width wf*W, aspect = size, placing the face (cx, cy as
    fractions of the source) at (fx, fy) of the window, then clamp to the image."""
    im = Image.open(ROOT + src + '.jpg').convert('RGB')
    W, H = im.size
    tw, th = size
    w = wf * W
    h = w * th / tw
    if h > H:
        h = H; w = h * tw / th
    left = cx * W - fx * w
    top = cy * H - fy * h
    left = max(0, min(W - w, left)); top = max(0, min(H - h, top))
    c = im.crop((round(left), round(top), round(left + w), round(top + h))).resize(size, Image.LANCZOS)
    os.makedirs(os.path.dirname(OUT + out), exist_ok=True)
    c.save(OUT + out + '.jpg', quality=q, optimize=True, progressive=True)

# hero tiles (kept at their existing pixel sizes): name, source, face centre, width fraction
HERO = [
  ('about-church','about-church',.47,.25,.42,(122,180)),
  ('cmu-pole','cmu-pole',.76,.80,.60,(135,180)),
  ('cmu-present','cmu-present',.46,.575,.30,(139,180)),
  ('cmu-lobby','cmu-lobby',.44,.25,.33,(180,117)),
  ('hosa-mic','hosa-mic',.575,.225,.26,(135,180)),
  ('hosp-or','hosp-or',.26,.36,.45,(135,180)),
  ('hosp-mirror','hosp-mirror',.66,.19,.40,(135,180)),
  ('vol-river','vol-river',.46,.32,.22,(165,180)),
  ('me-dog','me-dog',.50,.20,.34,(135,180)),
  ('kid-vest','co-vest',.51,.22,.50,(180,157)),
  ('kid-camp','co-camp',.40,.30,.50,(180,120)),
  ('me-balloons','media-balloons',.55,.28,.40,(180,155)),
  ('me-cake','cake-birthday',.675,.33,.30,(180,144)),
  ('me-gym','lift-mirror',.735,.175,.42,(180,162)),
  ('me-smile','perk-smile',.20,.39,.70,(180,180)),
  ('me-paws','perk-paws',.71,.25,.38,(170,180)),
  ('me-skeleton','perk-skeleton',.675,.47,.50,(180,153)),
  ('me-tired','run-tired',.36,.47,.50,(180,148)),
  ('me-drums','music-drums',.60,.25,.45,(180,153)),
  ('me-edrums','music-electric',.84,.33,.50,(180,153)),
  ('me-exhibit','vz-exhibit',.80,.31,.55,(180,171)),
  ('me-ap','perk-ap',.465,.25,.30,(180,162)),
  ('me-tux','photo-tux',.625,.43,.24,(180,173)),
]
# cards are 640x400
CARDS = [
  ('about-hover-panama','about-hover-panama',.49,.47,1.0),
  ('pa-ancon','pa-ancon',.47,.49,1.0),
  ('perk-skeleton','perk-skeleton',.675,.47,1.0),
  ('run-tired','run-tired',.36,.47,.70),
  ('hosp-or','hosp-or',.26,.36,1.0),
  ('vz-exhibit','vz-exhibit',.80,.31,1.0),
  ('cmu-lab','cmu-lab',.55,.30,1.0),
]
if __name__ == '__main__':
    only = set(sys.argv[2:])
    for n,s,cx,cy,wf,size in HERO:
        if not only or 'hero' in only or n in only: crop(s,cx,cy,wf,size,'hero/'+n)
    for n,s,cx,cy,wf in CARDS:
        if not only or 'card' in only or n in only: crop(s,cx,cy,wf,(640,400),'card/'+n, fy=.45)
