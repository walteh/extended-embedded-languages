#! /bin/bash

org_name=$1
branch_name=$2
force_merge=$3

git remote add $org_name git@github.com:$org_name/extended-embedded-languages.git
git fetch $org_name
git checkout -b $org_name/$branch_name -t $org_name/$branch_name
git push origin $org_name/$branch_name 
git branch --set-upstream-to=origin/$org_name/$branch_name $org_name/$branch_name
if [ "$force_merge" == "--force" ]; then
    git rebase -X theirs main
    git push --force
else
    git rebase main
    echo "Rebase started, you will need to force push (git push --force) after resolving conflicts"
fi
open https://github.com/walteh/extended-embedded-languages/pull/new/$org_name/$branch_name