from urllib.request import urlopen
from bs4 import BeautifulSoup
import GameParser
import VideoGrabber
import re
import csv

output_file = open('JEOPARDY.csv', 'w+')
csv_write = csv.DictWriter(output_file, ['air_date', 'answer', 'category',
                                         'isDailyDouble', 'question', 'round',
                                         'show_number', 'value', 'year'])
csv_write.writeheader()

season_link_re = re.compile('^showseason\.php\?season=')
show_link_re = re.compile('showgame\.php\?game_id=')
game_id_re = re.compile('showgame\.php\?game_id=(.*)')
full_url_re = re.compile('j-archive\.com')

season_list_page = urlopen('http://j-archive.com/listseasons.php')

season_soup = BeautifulSoup(season_list_page, 'html.parser')

# get all season links
season_links = list(
    map(
        lambda x: 'http://www.j-archive.com/{}'.format(x),
        filter(
            lambda x: season_link_re.search(x),
            map(lambda x: x.get('href'), season_soup.find_all('a'))
        )
    )
)

# using season links get show links
for idx, season_link in enumerate(season_links):
    game_list_page = urlopen(season_link)
    shows_soup = BeautifulSoup(game_list_page, 'html.parser')

    def mapHref(link):
        href = link.get('href')
        if (full_url_re.search(href) is None):
            href = 'http://j-archive.com/{}'.format(href)
        return href
    # get all show links
    show_links = list(
        filter(
            lambda x: show_link_re.search(x),
            map(mapHref, shows_soup.find_all('a'))
        )
    )
    for jdx, show_link in enumerate(show_links):
        print('season %d/%d - show %d/%d' % (idx + 1, len(season_links),
                                             jdx + 1, len(show_links)))
        game_page = urlopen(show_link)
        game_soup = BeautifulSoup(game_page, 'html.parser')
        game_id = int(game_id_re.search(show_link).group(1))
        GameParser.parse(game_soup, game_id, output_file)

output_file.close()

# save video locally and edit link href of csv
VideoGrabber.grab()
