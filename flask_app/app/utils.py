import re

lisst = [
    'https://www.instagram.com/introwwwert',
    'https://www.instagram.com/reel/',
    'https://www.instagram.com/p/',

    'https://t.me/introwwwerts',
    'https://t.me/c/',

    'https://www.tiktok.com/@frierenkawaiiiiiii',
    'https://www.tiktok.com/@frierenkawaiiiiiii/video/'
]


rgx_pattern = re.compile(r'''
 (?P<protocol>http[s]?)://
 (www.)?(?P<origin>instagram|t|tiktok)(.com|.me)?
 /(?P<object>reel|p|c|@)?(?:[^/]*)/?
 (?P<extra>video)?
''', re.VERBOSE)

for url in lisst:
    matches = re.search(
        rgx_pattern, url)
    if matches:
        print(matches.group(0), matches.groups(), end='\n')
    else:
        print(matches)


def identify_url(url: str, filter: dict) -> str:
    pass


# print(identify_url('https://www.instagram.com/p', urls_filter))
