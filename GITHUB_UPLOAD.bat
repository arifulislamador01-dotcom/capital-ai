@echo off
REM ========================================
REM Capital AI - GitHub Upload Script
REM এই ফাইলটি ডবল-ক্লিক করলেই আপনার কোড GitHub এ চলে যাবে!
REM ========================================

setlocal enabledelayedexpansion

cd /d d:\AI\akash-ai

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        Capital AI - GitHub Publication শুরু হচ্ছে...       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM ধাপ ১: Git configuration
echo [ধাপ ১/7] Git কনফিগারেশন সেট করছি...
git config --global user.name "Ariful Islam Ador"
git config --global user.email "arifulislamador01@gmail.com"
echo ✓ সম্পন্ন

REM ধাপ ২: Check if git is already initialized
echo.
echo [ধাপ ২/7] Repository চেক করছি...
if exist .git (
    echo ! Repository ইতিমধ্যে আছে - স্কিপ করছি
) else (
    git init
    echo ✓ Repository তৈরি হয়েছে
)

REM ধাপ ৩: Add all files
echo.
echo [ধাপ ৩/7] সব ফাইল যোগ করছি...
git add .
echo ✓ সম্পন্ন

REM ধাপ ৪: Commit
echo.
echo [ধাপ ৪/7] Commit করছি...
git commit -m "Capital AI - Production Ready with SEO Optimization"
echo ✓ সম্পন্ন

REM ধাপ ৫: Branch
echo.
echo [ধাপ ৫/7] Main branch এ চেঞ্জ করছি...
git branch -M main
echo ✓ সম্পন্ন

REM ধাপ ৬: Remote
echo.
echo [ধাপ ৬/7] Remote repository যোগ করছি...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/arifulislamador01-dotcom/capital-ai.git
echo ✓ সম্পন্ন

REM ধাপ ৭: Push
echo.
echo [ধাপ ৭/7] GitHub এ আপলোড করছি (এটি ১-২ মিনিট লাগতে পারে)...
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo.
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║                    ✓ সফল! সবকিছু সম্পন্ন!                ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.
    echo আপনার কোড GitHub এ আপলোড হয়েছে!
    echo.
    echo 📍 GitHub Repository:
    echo    https://github.com/arifulislamador01-dotcom/capital-ai
    echo.
    echo এখন করার কাজ:
    echo   1. Vercel এ যান: https://vercel.com
    echo   2. Sign Up → Continue with GitHub
    echo   3. New Project → capital-ai রেপোজিটরি সিলেক্ট করুন
    echo   4. Deploy করুন (৩০ সেকেন্ডে লাইভ হবে!)
    echo.
    pause
) else (
    echo.
    echo ✗ সমস্যা হয়েছে! 
    echo.
    echo সম্ভাব্য কারণ:
    echo   1. Git ইনস্টল নেই - https://git-scm.com থেকে ডাউনলোড করুন
    echo   2. Internet সংযোগ নেই
    echo   3. GitHub personal token প্রয়োজন হতে পারে
    echo.
    pause
)

endlocal
