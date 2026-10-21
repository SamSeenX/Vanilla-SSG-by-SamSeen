import { themeManager } from './core/theme-manager.js';
import { eventBus } from './core/event-bus.js';

document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();

  // Example: broadcast that client runtime has booted
  eventBus.emit('app:ready', { timestamp: Date.now() });
});
