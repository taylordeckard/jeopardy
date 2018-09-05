cat ../../postgres/setup/JEOPARDY_QUESTIONS1.csv | grep \.wmv | perl -pe 's|\<.*?\.jpg.*?\>||g' | sed s/^.*href=\"\"// | sed s/\".*$// | awk '{ str = $0; sub(/^.*\//, "", str); print $0 " -o ../media/"str;}' | grep http | xargs -n 3 curl;
cd ../media;
ls -l | awk '{ str = $9; sub(/\.wmv/, ".mp4", str); print "-i " $9 " -c:v libx264 -crf 23 -c:a aac -strict -2 -q:a 100 " str; }' | xargs -n 13 -I@ zsh -c 'ffmpeg @ || true'
