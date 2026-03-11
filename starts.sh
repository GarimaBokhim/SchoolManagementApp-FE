#!/bin/bash

# ===============================
# Setup Line Endings for Windows
# ===============================
git config core.autocrlf true

# ===============================
# Helper Functions
# ===============================

get_git_username() {
    GIT_USER=$(git config user.name)
    if [[ -z "$GIT_USER" ]]; then
        echo "Git username not set!"
        echo -n "Enter your Git username: "
        read GIT_USER
        git config user.name "$GIT_USER"
    fi
    echo "$GIT_USER"
}

get_git_repo_url() {
    REPO_URL=$(git config --get remote.origin.url)
    if [[ -z "$REPO_URL" ]]; then
        echo "No remote origin URL found!"
        exit 1
    fi

    # Convert SSH to HTTPS
    if [[ "$REPO_URL" == git@* ]]; then
        REPO_URL=${REPO_URL/git@/https://}
        REPO_URL=${REPO_URL/:/\//}
    fi

    REPO_URL=${REPO_URL%.git}
    echo "$REPO_URL"
}

commit_and_push() {
    echo "Adding all changes..."
    git add .

    echo -n "Enter commit message: "
    read COMMIT_MSG

    git commit -m "$COMMIT_MSG"

    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git push origin "$CURRENT_BRANCH"

    REPO_URL=$(get_git_repo_url)
    echo "PR Link: $REPO_URL/pull/new/$CURRENT_BRANCH"
}

create_branch_from_username() {
 # 1. Get user and branch info first
    GIT_USER=$(get_git_username)
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    # 2. ASK PROMPT: Get the feature name from you immediately
    echo -n "What feature are you working on? (e.g., login-ui): "
    read FEATURE_INPUT

    # Sanitize the input (replace spaces with hyphens)
    FEATURE_NAME=$(echo "$FEATURE_INPUT" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    # 3. Pull latest changes
    echo "Pulling latest changes from origin/$CURRENT_BRANCH..."
    git pull origin "$CURRENT_BRANCH"

    # 4. Construct the branch name with Date and Feature
    TS=$(date +%Y%m%d)
    BRANCH_NAME="feature/${GIT_USER}/${TS}-${FEATURE_NAME}"

    # 5. Create and switch
    echo "Creating and switching to branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"

    # 6. ASK PROMPT: Push to remote or not?
    echo -n "Push this branch to remote? (y/n): "
    read PUSH_CHOICE

    if [[ "$PUSH_CHOICE" =~ ^[Yy]$ ]]; then
        git push -u origin "$BRANCH_NAME"
        REPO_URL=$(get_git_repo_url)
        echo "------------------------------------------------"
        echo "PR Link: $REPO_URL/pull/new/$BRANCH_NAME"
        echo "------------------------------------------------"
    else
        echo "Branch created locally. Remember to push later!"
    fi
}

display_current_branch() {
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "Current working branch: $CURRENT_BRANCH"
}

# ===============================
# Option 4: Build React & Upload
# ===============================
publish_react_build() {
    echo "Building React app..."
    npm run build

    PUBLISH_DIR="build"

    REMOTE_USER="administrator"
    REMOTE_IP="45.117.153.128"
    REMOTE_PORT="22531"
    REMOTE_DIR="/home/administrator/Desktop/publish"

    echo "Uploading to remote VPS ($REMOTE_USER@$REMOTE_IP:$REMOTE_DIR)..."

    # Ensure remote folder exists
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_IP "mkdir -p $REMOTE_DIR"

    # Upload build files
    scp -P $REMOTE_PORT -r "$PUBLISH_DIR"/* $REMOTE_USER@$REMOTE_IP:"$REMOTE_DIR"

    echo "Build uploaded successfully to $REMOTE_USER@$REMOTE_IP:$REMOTE_DIR"
}

# ===============================
# Main Menu
# ===============================
while true; do
    echo ""
    echo "Select an option:"
    echo "1) Add, Commit, Push & Display PR link"
    echo "2) Pull latest, Create branch using Git username & checkout"
    echo "3) Display current working branch"
    echo "4) Build React app and publish files"
    echo "5) Exit"

    read -p "Enter choice: " choice

    case $choice in
        1) commit_and_push ;;
        2) create_branch_from_username ;;
        3) display_current_branch ;;
        4) publish_react_build ;;
        5) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid option!" ;;
    esac
done
