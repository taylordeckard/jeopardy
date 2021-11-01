import csv
import re

answer_re = re.compile('correct_response.*?>(.*?)<\/em>')
cleanr = re.compile('<.*?>')

round_dict = {'jeopardy_round':        'Jeopardy!',
              'double_jeopardy_round': 'Double Jeopardy!',
              'final_jeopardy_round':  'Final Jeopardy!'}


def parse(game_soup, show_number, output_file):
    print('Parsing show %d' % show_number)
    rounds = ['jeopardy_round', 'double_jeopardy_round',
              'final_jeopardy_round']
    air_date = game_soup.find(id='game_title').get_text()
    for r in rounds:
        round_soup = game_soup.find(id=r)
        if (round_soup is None):
            continue
        categories = round_soup.find_all(class_='category_name')
        category_names = list(map(lambda x: x.get_text(), categories))
        clues = round_soup.find_all(class_="clue")
        for idx, clue in enumerate(clues):
            record = {}
            clue_text = clue.find(class_='clue_text')
            if (clue_text is None):
                continue
            if (r == 'final_jeopardy_round'):
                answer_text = answer_re.search(
                    round_soup.find(class_='category').div['onmouseover'])
            else:
                answer_text = answer_re.search(
                    clue.table.tr.td.div['onmouseover'])
            record['air_date'] = air_date.split('-')[1].strip()
            record['answer'] = re.sub(cleanr, '', answer_text.group(1))
            record['category'] = category_names[idx % 6]
            clue_value = clue.find(class_='clue_value')
            value = None
            if (r != 'final_jeopardy_round'):
                if (clue_value is None):
                    record['isDailyDouble'] = True
                    daily_double = clue.find(class_='clue_value_daily_double')
                    value = daily_double.get_text().split(' ')[1]
                else:
                    value = clue_value.get_text()
            try:
                record['isDailyDouble']
            except KeyError:
                record['isDailyDouble'] = False
            record['question'] = ''.join(
                list(
                    map(lambda x: str(x), clue_text.contents)
                )
            )
            record['round'] = round_dict[r]
            record['show_number'] = show_number
            record['value'] = value
            record['year'] = record['air_date'].split(',')[2].strip()
            csv_write = csv.DictWriter(output_file, record.keys())
            csv_write.writerow(record)
