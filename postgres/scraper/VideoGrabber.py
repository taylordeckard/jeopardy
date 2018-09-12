import re
import requests
import os
import subprocess

wmv_re = re.compile(r'\.wmv')
wmv_url_re = re.compile(r'.*(http://.*?\.wmv)')
wmv_url_re_sub = re.compile(r'http://www.j-archive.com')
filename_re = re.compile(r'media/(.*?)\.wmv')


def grab():
    # read in csv record
    with open('./JEOPARDY.csv', 'r') as read_file:
        lines = read_file.readlines()

    urls_to_grab = []
    files_to_remove = []

    def wmv_url_map(wmv_line):
        wmv_url = wmv_url_re.search(wmv_line).group(1)
        filename = '../../client/media/{}.mp4'.format(
            filename_re.search(wmv_url).group(1)
        )
        if (os.path.isfile(filename) is False):
            urls_to_grab.append(wmv_url)

        return wmv_url

    # locate wmv files
    wmv_urls = list(
        map(wmv_url_map, filter(lambda x: wmv_re.search(x), lines))
    )

    print(len(wmv_urls))

    print(len(urls_to_grab))

    for url in urls_to_grab:
        r = requests.get(url)
        if (r.ok):
            filename = '../../client/media/{}.wmv'.format(
                filename_re.search(url).group(1)
            )
            with open(filename, 'wb+') as wmvFile:
                wmvFile.write(r.content)
                wmvFile.close()
            input_file = filename
            output_file = re.sub(wmv_re, '.mp4', filename)
            subprocess.run(['ffmpeg', '-i', input_file, '-c:v', 'libx264',
                            '-crf', '23', '-c:a', 'aac', '-strict', '-2',
                            '-q:a', '100', output_file])
            files_to_remove.append(input_file)

    for f in files_to_remove:
        try:
            os.remove(f)
            print(f)
        except FileNotFoundError:
            pass

    read_file.close()

    with open('./JEOPARDY.csv.tmp', 'w+') as write_file:
        for idx, line in enumerate(lines):
            url = wmv_url_re.search(line)
            if (url is not None):
                print('%d/%d' % (idx + 1, len(lines)))
                match_pattern = url.group(1)
                replacement = re.sub(wmv_url_re_sub, '', match_pattern)
                line = re.sub(match_pattern, replacement, line)
                line = re.sub(wmv_re, '.mp4', line)
            write_file.writelines(line)

    write_file.close()
