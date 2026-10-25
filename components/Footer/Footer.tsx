import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <p>© 2026 NoteHub. All rights reserved.</p>
      <p>
        Developer: Oleksandr Priadka | Contact us:{' '}
        <a href="mailto:student@notehub.app">student@notehub.app</a>
      </p>
    </footer>
  );
}