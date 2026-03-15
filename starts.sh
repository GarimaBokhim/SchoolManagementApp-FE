#!/bin/bash

# ===============================
# Enable alias expansion in scripts
# ===============================
shopt -s expand_aliases

# ===============================
# Load aliases from .myalias
# ===============================
if [ -f "$HOME/.myalias" ]; then
    source "$HOME/.myalias"
fi

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

    # Convert SSH to HTTPS if needed
    if [[ "$REPO_URL" == git@* ]]; then
        REPO_URL=${REPO_URL/git@/https://}
        REPO_URL=${REPO_URL/:/\//}
    fi

    REPO_URL=${REPO_URL%.git}
    echo "$REPO_URL"
}

# ===============================
# Option 1: Commit and Push
# ===============================
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

# ===============================
# Option 2: Create Branch From Username
# ===============================
create_branch_from_username() {
    GIT_USER=$(get_git_username)
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    echo -n "What feature are you working on? (e.g., login-ui): "
    read FEATURE_INPUT

    FEATURE_NAME=$(echo "$FEATURE_INPUT" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    echo "Pulling latest changes from origin/$CURRENT_BRANCH..."
    git pull origin "$CURRENT_BRANCH"

    TS=$(date +%Y%m%d)
    BRANCH_NAME="feature/${GIT_USER}/${TS}-${FEATURE_NAME}"

    echo "Creating and switching to branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"

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

# ===============================
# Option 3: Display Current Branch
# ===============================
display_current_branch() {
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "Current working branch: $CURRENT_BRANCH"
}

# ===============================
# Option 4: Build React & Publish
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
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_IP "mkdir -p $REMOTE_DIR"
    scp -P $REMOTE_PORT -r "$PUBLISH_DIR"/* $REMOTE_USER@$REMOTE_IP:"$REMOTE_DIR"

    echo "Build uploaded successfully to $REMOTE_USER@$REMOTE_IP:$REMOTE_DIR"
}

# ===============================
# Option 5: Run React Dev Server
# ===============================
run_react_dev() {
    PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$PROJECT_DIR" || { echo "Failed to change directory"; return 1; }

    # Pull latest first
    echo "Pulling latest changes from origin/main..."
    git pull origin main

    # Open VS Code
    echo "Opening VS Code..."
    code .

    # Start React dev server
    echo "Starting React dev server..."
    pnpm run dev
}

# ===============================
# Option 6: Go to Code and Pull Latest
# ===============================
go_to_code() {
    PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    echo "Using project directory: $PROJECT_DIR"
    cd "$PROJECT_DIR" || { echo "Failed to change directory"; return 1; }

    echo "Opening VS Code..."
    code .

    echo "Pulling latest changes from origin/main..."
    git pull origin main
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
    echo "5) Run React dev server"
    echo "6) Go to code and pull latest"
    echo "7) Exit"

    read -p "Enter choice: " choice

    case $choice in
        1) commit_and_push ;;
        2) create_branch_from_username ;;
        3) display_current_branch ;;
        4) publish_react_build ;;
        5) run_react_dev ;;
        6) go_to_code ;;
        7) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid option!" ;;
    esac
done