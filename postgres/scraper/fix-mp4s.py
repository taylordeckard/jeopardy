import re

lines = []
with open('JEOPARDY-fix.csv') as f:
    lines = f.readlines()

with open('output.csv', 'w') as out:
    p = re.compile('href=""(.*?)/media/.*?\.mp4')
    for line in lines:
        search = re.search(p, line)
        if search:
            strToRemove = search.group(1)
            newLine = line.replace(strToRemove, '')
            out.write(newLine)
        else:
            out.write(line)

