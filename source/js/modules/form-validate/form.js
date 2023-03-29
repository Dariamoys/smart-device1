import {Validator} from './validator';
import {callbacks} from './callback';
import {initPhoneInput} from './init-phone-input';

export class Form {
  constructor() {
    this._validator = new Validator();
    this._initPhoneInput = initPhoneInput;
    this._callbacks = callbacks;
  }

  reset(form) {
    form.reset();
    form.querySelectorAll('.is-invalid').forEach((item) => item.classList.remove('is-invalid'));
    form.querySelectorAll('.is-valid').forEach((item) => item.classList.remove('is-valid'));
    form.querySelectorAll('.input-message').forEach((item) => item.remove());
    setTimeout(() => {
      this._resetSelects(form);
    });
  }

  initPhoneInput(parent) {
    this._initPhoneInput(parent);
  }

  validateForm(form) {
    return this._validator.validateForm(form);
  }

  validateFormElement(item) {
    return this._validator.validateFormElement(item);
  }

  _onFormSubmit(event, callback = null) {
    if (this.validateForm(event.target) && callback) {
      this._callbacks[callback].successCallback(event);
      if (this._callbacks[callback].reset) {
        setTimeout(() => {
          this.reset(event.target);
        }, this._callbacks[callback].resetTimeout ? this._callbacks[callback].resetTimeout : 500);
      }
      return;
    }
    if (!this.validateForm(event.target) && callback) {
      this._callbacks[callback].errorCallback(event);
      return;
    }
  }

  _onFormInput(item) {
    this.validateFormElement(item);
  }

  _initValidate(parent) {
    const form = parent.querySelector('form');
    if (!form) {
      return;
    }

    const phoneParents = form.querySelectorAll('[data-validate-type="phone"]');
    phoneParents.forEach((item) => this._initPhoneInput(item));

    const callback = parent.dataset.callback;
    form.noValidate = true;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this._onFormSubmit(event, callback);
    });

    form.addEventListener('input', (event) => {
      this._onFormInput(event.target);
    });

    form.addEventListener('reset', (event) => {
      this.reset(event.target);
    });
  }

  init() {
    this._validateParent = document.querySelectorAll('[data-form-validate]');
    if (!this._validateParent.length) {
      return;
    }
    this._validateParent.forEach((parent) => this._initValidate(parent));
  }
}
