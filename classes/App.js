import axios from 'axios';
import 'vanilla-colorful';
import { showNotification } from '../modules/showNotification.js';

export default class App {
  constructor(root) {
    // 🚀 Props
    this.root = root;

    // 🚀 Render Skeleton
    this.root.innerHTML = `
      <h3 class='title'>Color Finder</h3>
      <div class='content'>
        <div class='picker'>
          <hex-color-picker color='#1e88e5'></hex-color-picker>
          <input type='text' disabled value='#1e88e5' data-input=''>
          <button data-submit=''>Submit</button>
        </div>
        <div class='result'></div>
      </div>
    `;

    // 🚀 Query Selectors
    this.DOM = {
      submitBtn: document.querySelector('[data-submit]'),
      input: document.querySelector('[data-input]'),
      result: document.querySelector('.result'),
      picker: document.querySelector('hex-color-picker'),
    };

    // 🚀 Events Listeners
    this.DOM.picker.addEventListener('color-changed', ({ detail: { value } }) => this.DOM.input.value = value);
    this.DOM.submitBtn.addEventListener('click', this.onSubmit);
  }

  //===============================================
  // 🚀 Methods
  //===============================================
  /**
   * @function onSubmit - Form submit event handler
   * @param event
   */
  onSubmit = async () => {
    this.DOM.result.classList.remove('open');
    this.DOM.submitBtn.textContent = 'Loading...';

    try {
      const { data: { colors } } = await axios.get(`https://api.color.pizza/v1/?values=${this.DOM.input.value.split('#')[1]}`);
      const { name, hex, rgb, hsl, luminance, luminanceWCAG, lab } = colors[0];
      this.DOM.result.innerHTML = `
        <h3>About <span>${hex}</span></h3>
        <img src='https://api.color.pizza/v1/swatch/?color=${this.DOM.input.value.split('#')[1]}&name=${name}' alt='${name}'>
        <div class='table'>
          <p><span class='h6'>Color Name</span><span>${name}</span></p>
          <p><span class='h6'>RGB Values</span><span>(${rgb.r}, ${rgb.g}, ${rgb.b})</span></p>
          <p><span class='h6'>HSL Values</span><span>(${hsl.h.toFixed(0)}, ${hsl.s.toFixed(0)}%, ${hsl.l.toFixed(0)}%)</span></p>
          <p><span class='h6'>LAB Values</span><span>(${lab.l}, ${lab.a}, ${lab.b})</span></p>
          <p><span class='h6'>Luminances</span><span>(${luminance})</span></p>
          <p><span class='h6'>Luminance WCAG</span><span>(${luminanceWCAG})</span></p>
        </div>
      `;

      setTimeout(() => {
        this.DOM.result.classList.add('open');
        this.DOM.submitBtn.textContent = 'Submit';
      }, 1200);

    } catch (e) {
      showNotification('danger', 'Something went wrong, open developer console.');
      console.log(e);

      this.DOM.result.classList.remove('open');
      this.DOM.result.innerHTML = '';
      this.DOM.submitBtn.textContent = 'Submit';
    }
  };
}
