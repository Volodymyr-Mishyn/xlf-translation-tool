# XLF translation tool

## Summary

Hey! Have you ever found yourself frustrated about working with `*.xlf` translation files? Do you need to translate your application into multiple languages at once? All you need is this app and **application key for Google Cloud Translation service**.

## How to use

1. Get the API Key

   First of all, you must acquire [Google Cloud Translation](https://cloud.google.com/translate/docs/setup) API key. Payment required to use this service. But it's not that expensive. (I spent couple of $ to translate my Angular app fully).

   The process of setup and getting API key is straightforward and easy.

2. Setting application to work

   First of all, pull the app, install dependencies

   ```txt
   $ git clone https://github.com/Volodymyr-Mishyn/xlf-translation-tool.git
   $ cd xlf-translation-tool
   $ npm install
   ```

   Then place your `*.xlf` file with source for translations into `input` folder.

   Setup settings for translations in `config/default.json`: Source, target languages, etc.

   Create `.env` file in root of directory and place your **API KEY** there, example provided with `.env.example`.
   Otherwise you can just set environment variable **GOOGLE_APPLICATION_API_KEY** with your **API KEY**.

3. Run the app

   ```txt
   $ npm run start
   ```

   Enjoy your translation files in output folder.
