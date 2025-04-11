#!/bin/bash

# इस फाइल को निष्पादित करने के लिए, ये कमांड चलाएं:
# chmod +x github-setup.sh
# ./github-setup.sh <your-github-username> <your-github-email> <your-personal-access-token> <repository-name>

# उदाहरण:
# ./github-setup.sh johndoe johndoe@example.com ghp_abcdefghijklmnopqrstuvwxyz123456789 ipl-ticket-booking

# अपने कमांड लाइन से मिले आर्गुमेंट्स सेट करें
GITHUB_USERNAME=$1
GITHUB_EMAIL=$2
GITHUB_TOKEN=$3
REPO_NAME=$4

# Git कॉन्फिगरेशन सेट करें
git config --global user.name "$GITHUB_USERNAME"
git config --global user.email "$GITHUB_EMAIL"

# नए URL को सेट करें जिसमें आपका टोकन शामिल है
REPO_URL="https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# ओरिजिन रिमोट को सेट या अपडेट करें
if git remote | grep -q "origin"; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

# सुनिश्चित करें कि सभी बदलाव कमिट किए गए हैं
git add .
git commit -m "Initial commit of IPL Ticket Booking website" || echo "No changes to commit"

# मेन ब्रांच पर पुश करें
git push -u origin main

echo "GitHub सेटअप पूरा हुआ! रिपॉजिटरी अपलोड हो गई है: https://github.com/$GITHUB_USERNAME/$REPO_NAME"