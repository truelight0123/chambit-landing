const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw3sJ6yw9_6vtgewfCEIQi9Xtdw8cfS-HRfqcZdeUDZz_q-JxtErn1o9ntYktkO-82R/exec";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

window.addEventListener('DOMContentLoaded', function () {
  const ref = getQueryParam('ref');

  if (ref) {
    localStorage.setItem('ref_code', ref);
  }

  const savedRef = localStorage.getItem('ref_code') || '';
  const refInput = document.getElementById('referral_code');
  const refDisplay = document.getElementById('refCodeDisplay');

  if (refInput) refInput.value = savedRef;
  if (refDisplay) refDisplay.textContent = savedRef || '없음';
});

const consultationForm = document.getElementById('consultationForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitBtnLoading = document.getElementById('submitBtnLoading');
const formSuccess = document.getElementById('formSuccess');
const formResetBtn = document.getElementById('formResetBtn');

if (consultationForm) {
  consultationForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name')?.value.trim() || '',
      phone: document.getElementById('phone')?.value.trim() || '',
      region: document.getElementById('region')?.value.trim() || '',
      consultType: document.getElementById('consultType')?.value || '',
      installTarget: document.getElementById('installTarget')?.value || '',
      purpose: document.getElementById('purpose')?.value.trim() || '',
      message: document.getElementById('message')?.value.trim() || '',
      referralCodeInput: document.getElementById('referral_code')?.value.trim() || ''
    };

    if (!formData.name) {
      alert('이름을 입력해 주세요.');
      return;
    }

    if (!formData.phone) {
      alert('연락처를 입력해 주세요.');
      return;
    }

    try {
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.style.display = 'none';
      if (submitBtnLoading) submitBtnLoading.style.display = 'inline';

      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        consultationForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        alert('접수 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
      }

    } catch (error) {
      console.error(error);
      alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitBtnText) submitBtnText.style.display = 'inline';
      if (submitBtnLoading) submitBtnLoading.style.display = 'none';
    }
  });
}

if (formResetBtn) {
  formResetBtn.addEventListener('click', () => {
    consultationForm.reset();

    const savedRef = localStorage.getItem('ref_code') || '';
    const refInput = document.getElementById('referral_code');
    if (refInput) refInput.value = savedRef;

    if (formSuccess) formSuccess.style.display = 'none';
    if (consultationForm) consultationForm.style.display = 'block';
  });
}