/* ==========================================================================
   ひだまり個別教室 LP(ポートフォリオ用・架空サイト)
   やっていること
   1. よくある質問(FAQ)の開閉
   2. 申込フォームの入力チェック(ダミー: 実際には送信しません)
   ========================================================================== */
(function () {
  'use strict';

  /* 1. FAQ ---------------------------------------------------------------
     HTMLでは全て開いた状態で書いてあり(JSが動かなくても読める)、
     JSが動いたときだけ「最初の2件を残して閉じる」。 */
  var OPEN_COUNT = 2;

  function setFaq(button, open) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }

  document.querySelectorAll('.faq__button').forEach(function (button, index) {
    setFaq(button, index < OPEN_COUNT);
    button.addEventListener('click', function () {
      setFaq(button, button.getAttribute('aria-expanded') !== 'true');
    });
  });


  /* 2. フォームの入力チェック -------------------------------------------- */
  var form = document.getElementById('entry-form');
  var message = document.getElementById('form-message');
  if (!form) return;

  // 項目名 → エラー文(問題なければ空文字を返す)
  var rules = {
    parent: function (value) {
      return value.trim() ? '' : 'お名前を入力してください。';
    },
    grade: function (value) {
      return value ? '' : '学年を選択してください。';
    },
    email: function (value) {
      var v = value.trim();
      if (!v) return 'メールアドレスを入力してください。';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'メールアドレスの形式をご確認ください。';
    }
  };

  function validateField(name) {
    var input = form.elements[name];
    var error = document.getElementById(name + '-error');
    var text = rules[name](input.value);
    error.textContent = text;
    error.hidden = !text;
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    return !text;
  }

  // 入力欄から離れたとき、すでにエラーが出ている欄は再チェックする
  Object.keys(rules).forEach(function (name) {
    form.elements[name].addEventListener('blur', function () {
      if (form.elements[name].getAttribute('aria-invalid') === 'true') validateField(name);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();          // 実際には送信しない
    message.hidden = true;

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });

    if (firstInvalid) {
      firstInvalid.focus();          // 最初のエラー欄にカーソルを移す
      return;
    }

    message.textContent = 'ありがとうございます。これは学習用の架空サイトのため、入力内容は送信されません(デモ表示です)。';
    message.hidden = false;
    form.reset();
  });
})();
