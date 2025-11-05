@echo off
echo ========================================
echo   EAAC Pearson BTEC - GitHub Pages Deploy
echo ========================================
echo.

echo 📁 Adding all files...
git add .

echo 📝 Committing changes...
git commit -m "Deploy EAAC Pearson BTEC website to GitHub Pages"

echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ Deployment complete!
echo 🌐 Your website will be available at:
echo    https://mazendeebo.github.io/EAAC_Pearson/
echo.
echo ⏱️  Please wait 2-5 minutes for GitHub Pages to update.
echo.
pause
