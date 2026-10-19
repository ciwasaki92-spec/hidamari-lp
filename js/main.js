/* ==========================================================================
   ひだまり個別教室 LP(ポートフォリオ用・架空サイト)
   やっていること
   0. スマホのハンバーガーメニューの開閉
   1. よくある質問(FAQ)の開閉
   2. 申込フォームの入力チェック(ダミー: 実際には送信しません)
   ========================================================================== */
(function () {
  'use strict';

  /* 0. ハンバーガーメニュー --------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('global-nav');
  var pcQuery = window.matchMedia('(min-width: 1100px)');

  function setNav(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.nav-toggle__label').textContent = open ? '閉じる' : 'メニュー';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-nav-open', open);
    // 開いている間は、後ろのページを操作できないようにする(Tabでメニューの外に出ないように)
    document.querySelectorAll('main, .site-footer, .skip-link').forEach(function (el) {
      el.inert = open;
    });
    // 開いたら、最初のリンクにフォーカスを移す
    if (open) nav.querySelector('a').focus();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    // メニュー内のリンクを押したら閉じる(ページ内の該当箇所へ移動する)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });
    // Escキーで閉じて、ボタンにフォーカスを戻す
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
    // PC幅に広げたら、開いたままの状態をリセット
    pcQuery.addEventListener('change', function (e) { if (e.matches) setNav(false); });
  }

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
