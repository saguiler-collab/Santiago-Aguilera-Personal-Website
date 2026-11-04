"""Build the Media page's photo list: curate every photograph on the site, cut a small
thumbnail of each into assets/photos/thumb/, and write tools/media-list.json, which
tools/build-pages.js turns into the gallery. Run from the repo root:  python3 tools/make-media.py

Documents, screenshots, certificates, posters and slides are left out on purpose; the pages
they belong to already show them."""
import json, os, itertools
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PH = os.path.join(ROOT, 'assets', 'photos')
TH = os.path.join(PH, 'thumb')
os.makedirs(TH, exist_ok=True)

# (file, caption, tag, category)   categories: Me, Music, Places, School, Leadership, Sport, Research, Games
L = []
def add(cat, tag, items):
    for f, cap in items: L.append((f, cap, tag, cat))

add('Me', 'Me', [
 ('about-church', 'Portrait'), ('photo-tux', 'Dressed up on the lawn'), ('tt-grass', 'Out in the tall grass, Trinidad'),
 ('me-dog', 'Carrying the dog'), ('us-fifteen', 'Fifteen years ago'), ('perk-smile', 'Happy in the blazer and tie'), ('me-sky', 'Sweat, sky and earbuds, after a run')])
add('Music', 'Music', [
 ('music-staffband', 'On the drums with the ISPS Staff Band, “School’s Out”, June 2025'), ('music-staffband2', 'Looking across the stage mid-song, ISPS end-of-year assembly'),
 ('music-pit1', 'In the pit, seen from above'), ('music-pit2', 'Mid-fill, the sheet music beside me'), ('music-ekit', 'The electric kit at home'),
 ('music-sing1', 'Singing “De música ligera” by Soda Stereo'), ('music-sing2', 'Mid-jump, the band behind me'),
 ('music-prock', 'Drumming under the tent in a PRock shirt'), ('music-stagefist', 'Fists up on stage, the lights behind'),
 ('music-redkit', 'Selfie from behind the kit, the band in front'), ('music-purple', 'Another night at the kit, under purple light'),
 ('music-prock2', 'Locked in on the hi-hat'), ('music-pov', 'The view from the throne'), ('music-drums', 'Behind the kit'),
 ('music-electric', 'On the electric kit at home, headphones on'), ('music-band', 'The band before the set'),
 ('music-stage', 'Rehearsal on the Perkiomen stage'), ('music-flyer', 'The Perk Rock Band Concert poster, Friday October 30'),
 ('eport-kits', "Two kits: the school's acoustic kit and the electric kit at home"), ('eport-perform', 'The e-Portfolio rehearsal performance'),
 ('isps-apvybz2', 'AP Vybz members performing and rehearsing'), ('isps-apvybz', 'AP Vybz, the school music organization')])
add('Places', 'Mexico', [('kid-pirate', 'Dressed up as a pirate'), ('mx-halloween', 'Halloween in Monterrey, as a zombie'),
 ('mx-church', 'Inside a church in Mexico')])
add('Places', 'Colombia', [('co-mammoth', 'Riding a mammoth at the dinosaur park'), ('co-dino', 'Face to face with a T. rex, map guide in hand'),
 ('co-goat', 'Lying on a bronze goat above a canyon'), ('co-camp', 'Outside the shelter we built'), ('co-vest', 'Life jacket on, ready for the canoe'),
 ('co-tilata-balcony', 'On a balcony in the hills, in the Tilatá shirt'), ('co-tilata-pair', 'With my brother, ready for school in our Colegio Tilatá uniforms')])
add('Places', 'Peru', [('trip-peru', 'With an alpaca and its keeper in the Andes')])
add('Places', 'Panama', [('pa-ancon', 'At the Cerro Ancón nature reserve')])
add('Places', 'Trinidad', [('trip-bench', 'On a bench by the water, with the dog'), 
 ('tt-birthday', 'Turning sixteen'), ('tt-dog', 'A walk with the dog'), ('run-tired', 'Finishing a long one in Trinidad, worn out and happy')])
add('Places', 'Travel', [('night-umbrella', 'A rainy night under a teal umbrella')])
add('Places', 'Tobago', [('tt-beach', 'In the sea with friends, Tobago')])
add('Places', 'United States', [('us-bean', 'Under Cloud Gate, Chicago'), ('us-flags', 'The Mexican and American flags, side by side')])
add('Places', 'Europe', [('madrid-hat', 'Madrid, in a bobble hat'), ('trip-madrid', 'Back at La Escuelita, Madrid'), ('trip-versailles', 'The gates of Versailles')])
add('Places', 'Travel', [('sea-arms', 'Arms wide at dusk'), ('sea-look', 'Watching the waves come in'), ('trip-beach', "Sunset at the water's edge"),
 ('media-balloons', 'Inside a room of mirrored balloons'), ('media-retro', 'A walk through a 1970s living room exhibit')])
add('School', 'ISPS', [('isps-ceremony', 'Shaking hands on stage at an ISPS awards ceremony'), ('isps-jeffries', 'The Mr. Jeffries Memorial Award plaque, 2022–2023'),
 ('isps-design-measure', 'Measuring plywood in the design workshop'), ('isps-design-saw', 'Cutting with a circular saw in the design workshop'),
 ('isps-stuco', 'Student Council at ISPS, in the white polos'), ('isps-tug', 'Tug of war for Mayaro house'),
 ('isps-recreation', 'My recreation of Guayasamín, for Spanish class')])
add('School', 'Perkiomen', [('perk-room', 'My first room at Perkiomen, the start of my own adventure'), ('perk-paws', 'With the Perkiomen Panther mascot'),
 ('perk-blazer', 'At the microphone in a Perkiomen tie'), ('perk-awards', "Receiving the folder at Perkiomen's awards ceremony"),
 ('perk-bell', 'Ringing the bell as a procession climbs the steps, 2027 chalked underfoot'), ('perk-chalk', 'Chalking the steps with two classmates'),
 ('perk-podium', 'Stepping away from the podium at an outdoor ceremony'), ('perk-door', "Perkiomen School's post on earning the AP International Diploma"),
 ('perk-senator', 'With Senator Pennycuick'), ('perk-group', 'With friends on the lawn at Perkiomen'), ('perk-skeleton', 'Meeting Alberto, the anatomy skeleton, in class'),
 ('cake-birthday', 'A birthday dinner in the dining hall'), ('perk-sky1', 'A winter sunset over campus'), ('perk-sky2', 'Dusk on the lawn'), ('perk-sky3', 'A rainbow after the storm')])
add('School', 'Exeter', [('exeter-banner', 'Under the Exeter banner'), ('exeter-shoulders', 'Celebrating under the Exeter banner'), ('exeter-blazer', 'Blazer on, sunset over the river'),
 ('exeter-dock', 'Arms out on the dock'), ('exeter-river', 'Along the river in Exeter'), ('exeter-quad', 'The quad on a bright summer day'),
 ('exeter-hall', 'The Academy building at dusk'), ('exeter-library', 'Inside the Phillips Exeter Academy library'), ('exeter-pingpong', 'Hanging out in the dorm common room'),
 ('exeter-football', 'Evening football on the lawn with friends from the program'), ('exeter-coaster', 'Canobie Lake Park, summer 2025'),
 ('exeter-shirt', 'Friends and instructors signing shirts on the last day'), ('exeter-hands', 'A team huddle in class'), ('exeter-reading', 'Leadership readings, highlighted and annotated')])
add('School', 'Carnegie Mellon', [('cmu-hearts', 'The full Carnegie Mellon cohort, summer 2026'), ('cmu-friends', 'With three friends from the program, a medal around one neck'),
 ('cmu-lab', 'In the lab with teammates'), ('gbm-2', 'The team, mid-project'), ('cmu-present', 'Presenting with the team'), ('cmu-lecture', 'Final project presentation in the lecture hall'),
 ('cmu-lobby', 'With a teammate and two of the instructors'), ('cmu-fireworks', 'Fireworks over campus with friends from the program'),
 ('cmu-pole', 'Looking up at the Walking to the Sky sculpture'), ('cmu-night', 'Out on S. Craig Street, Pittsburgh, after a long day')])
add('Leadership', 'HOSA', [('hosa-mic', 'Addressing the room at a school event'), 
 ('hosa-crowd', 'With fellow students in the gym'), ('hosa-anatomy', 'Holding an anatomy model at the HOSA table'),
 ('hosa-volleyball', 'The HOSA volleyball tournament, with the cancer-awareness bracelets')])
add('Leadership', 'Student Council', [('stuco-room', 'Between sessions at the NASSP conference in Chicago, January 2025')])
add('Leadership', 'Model UN', [('mun-eagle', 'At Eagle MUNC')])
add('Leadership', 'Volunteering', [('vol-river', 'Pulling a tire out of the river on a clean-up day'), ('vol-bingo', 'Bingo with residents at a care home'),
 ('vol-water', 'Running a water station at a race')])
add('Leadership', 'Hospital', [('hosp-or', 'Watching a procedure from the operating table'), ('hosp-mirror', 'Between cases, scrubs and mask'),
 ('hosp-facade', 'The hospital facade'), ('hosp-mural', 'The Hospital Regional de Veracruz mural'), ('hosp-patient', 'A young patient and her surgeon'),
 ('hosp-talk', 'A teaching session on appendicitis presentation'), ('hosp-ultrasound', 'Walking through an ultrasound with the residents'),
 ('hosp-mri', 'MRI cholangiogram on the radiology workstation'), ('shadow-1', 'In the operating room at HAEV'), ('shadow-2', 'Between cases, summer 2026')])
add('Research', 'SanaSanita', [('sana-field-rounds', 'Morning case presentation'), ('sana-field-surgery', 'Laparoscopic view, mid-procedure'),
 ('sana-field-teaching', 'Reading an ultrasound with the team')])
add('Research', 'Venezuela paper', [('vz-2', 'Presenting the work at the Personal Project Exhibition'), ('vz-exhibit', 'Explaining the project at the Personal Project Exhibition'),
 ('vz-board', 'The Personal Project display board')])
add('Sport', 'Swimming', [('swim-blocks', 'On the starting block'), ('swim-mip', 'The 2025–2026 Boys Swimming Team MIP plaque')])
add('Sport', 'Weightlifting', [('lift-squat', 'Back squats'), ('lift-mirror', 'Between sets in the gym'), ('lift-tank', 'A pump in the school gym'),
 ('lift-blue', 'In the Perkiomen weight room, paw print on the wall'),
 ('lift-compression', 'Belt and wrist straps on in the Perkiomen weight room'), ('lift-press', 'Grinding out a rep on the shoulder press')])
add('Sport', 'Running', [('run-bibs', 'RBC Race for the Kids, 15K bibs'), ('run-thumbs', 'Mid-race, 15K, bib 437'), ('run-yellow', 'Out in front on a group run in Port of Spain')])
add('Games', 'Video games', [('games-artorias', 'Dark Souls'), ('games-solaire', 'Dark Souls, with Solaire'), ('games-zelda', 'The Wind Waker HD on the Wii U'),
 ('games-rb1', 'Sunset over the hills, in-game'), ('games-rb2', 'A full moon through the grass, in-game'), ('games-rb3', 'Facing the sun, in-game'),
 ('games-totk', 'The Demon Dragon, the final boss of Zelda: Tears of the Kingdom'), ('games-rb4', 'Golden hour over the grass, in-game'), ('games-rb5', 'Watching the sun go down, in-game')])

# round-robin across categories so the grid is not 14 Exeter photos in a row
order = ['Me', 'Music', 'Places', 'School', 'Leadership', 'Sport', 'Research', 'Games']
groups = {c: [x for x in L if x[3] == c] for c in order}
mixed = [x for tup in itertools.zip_longest(*[groups[c] for c in order]) for x in tup if x]
out, seen = [], set()
for f, cap, tag, cat in mixed:
    if f in seen: continue
    seen.add(f)
    src = os.path.join(PH, f + '.jpg')
    im = Image.open(src).convert('RGB'); w, h = im.size
    tw = 560 if w >= h else 440
    th = round(h * tw / w)
    t = im.resize((tw, th), Image.LANCZOS)
    t.save(os.path.join(TH, f + '.jpg'), quality=74, optimize=True, progressive=True)
    out.append({'file': f, 'caption': cap, 'tag': tag, 'cat': cat, 'w': tw, 'h': th, 'fw': w, 'fh': h})
video = {'src': '/assets/video/perk-suit.mp4', 'poster': '/assets/video/perk-suit.jpg', 'caption': 'In the Perkiomen blazer and tie', 'tag': 'Perkiomen', 'cat': 'Video'}
json.dump({'photos': out, 'video': video, 'cats': order}, open(os.path.join(ROOT, 'tools', 'media-list.json'), 'w'), indent=1, ensure_ascii=False)
print(len(out), 'photos')
missing = [f for f in os.listdir(PH) if f.endswith('.jpg') and f[:-4] not in seen]
print('left out:', ', '.join(sorted(m[:-4] for m in missing)))
