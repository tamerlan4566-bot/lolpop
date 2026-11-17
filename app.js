* ===== Чертоги Разума — app.js ===== */
/* global CryptoJS */
'use strict';
// ==================== СОСТОЯНИЕ ====================
const STORAGE_KEY_DATA     = 'mind_palace_encrypted_v1';
const STORAGE_KEY_PIN_HASH = 'mind_palace_pin_hash_v1';
const DEFAULT_PIN          = '0000';
let currentPin          = null;
let vaultData           = { cards: [], links: [] };
let linkMode            = false;
let firstSelectedCardId = null;
let calcInput           = '';
// Единственные ссылки на window-обработчики (делегированные)
let _activeDrag = null;  // { el, cardObj, startX, startY, origX, origY }
// Панорамирование доски
let _panState = null;    // { startX, startY, origScrollX, origScrollY }
// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем хэш PIN по умолчанию при первом запуске
    if (!localStorage.getItem(STORAGE_KEY_PIN_HASH)) {
        localStorage.setItem(STORAGE_KEY_PIN_HASH, CryptoJS.SHA256(DEFAULT_PIN).toString());
    }
    // Привязываем единые делегированные обработчики
    bindCalcButtons();
    bindKeyboard();
    bindDelegatedDrag();
    bindBoardPanning();
    bindSidebarToggle();
    bindModalButtons();
});
// ==================== КАЛЬКУЛЯТОР ====================
function bindCalcButtons() {
    document.getElementById('calculator-facade').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-calc]');
        if (!btn) return;
        const action = btn.dataset.calc;
        if (action === 'clear')     { calcClear(); return; }
        if (action === 'backspace') { calcBackspace(); return; }
        if (action === 'eval')      { calcEvaluate(); return; }
        // append
        calcAppend(action);
