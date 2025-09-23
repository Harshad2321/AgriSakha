# GitHub Pages Deployment Fix for AgriSakha

## Issue
GitHub Actions deployment is failing with permission error:
```
Permission to Harshad2321/AgriSakha.git denied to github-actions[bot].
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
```

## Solutions

### Option 1: Enable GitHub Actions for Pages (Recommended)

1. **Go to Repository Settings:**
   - Navigate to: https://github.com/Harshad2321/AgriSakha/settings/pages

2. **Update Pages Source:**
   - Under "Source", select **"GitHub Actions"** instead of "Deploy from a branch"
   - This allows GitHub Actions to deploy directly without needing to push to gh-pages branch

3. **Update Workflow Permissions:**
   - Go to: https://github.com/Harshad2321/AgriSakha/settings/actions
   - Under "Workflow permissions", select **"Read and write permissions"**
   - Check "Allow GitHub Actions to create and approve pull requests"

### Option 2: Classic GitHub Pages (Alternative)

If you prefer the classic approach:

1. **Create gh-pages branch manually:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   echo "GitHub Pages placeholder" > index.html
   git add index.html
   git commit -m "Initial gh-pages commit"
   git push origin gh-pages
   git checkout main
   ```

2. **Set Pages to use gh-pages branch:**
   - Go to Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select "gh-pages" branch and "/ (root)" folder

### Option 3: Use Deploy Keys (Advanced)

1. **Generate SSH Deploy Key:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions-deploy
   ```

2. **Add to Repository:**
   - Add public key to: Settings → Deploy keys (with write access)
   - Add private key to: Settings → Secrets → Actions as `DEPLOY_PRIVATE_KEY`

## Environment Variables

Make sure to set the backend URL:

1. **Go to Repository Settings:**
   - Navigate to: https://github.com/Harshad2321/AgriSakha/settings/variables/actions

2. **Add Repository Variable:**
   - Name: `REACT_APP_API_URL`
   - Value: Your backend URL (e.g., `https://your-backend.herokuapp.com`)

## Updated Workflow

The updated `.github/workflows/deploy.yml` now uses:
- Latest GitHub Actions versions (v4)
- Proper permissions for Pages deployment
- Modern GitHub Pages deployment method
- Better error handling

## Testing the Fix

After implementing Option 1:
1. Commit and push the updated workflow file
2. Check the Actions tab for deployment status
3. Visit: https://harshad2321.github.io/AgriSakha

## Troubleshooting

If issues persist:
1. Check Actions tab for detailed error logs
2. Verify repository permissions
3. Ensure the backend URL is accessible
4. Try the alternative workflow file (deploy-alternative.yml.backup)

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `frontend/public/` directory
2. Update DNS settings for your domain
3. Configure custom domain in Pages settings