function saveEntry() {
    const date = document.getElementById('journal-date').value;
    const text = document.getElementById('journal-entry').value;
  
    if (!date || !text) {
      alert("Don't ghost the date or your thoughts 😤");
      return;
    }
  
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || {};
    entries[date] = text;
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
    document.getElementById('journal-entry').value = '';
  }
  
  function displayEntries() {
    const entryList = document.getElementById('entry-list');
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || {};
  
    entryList.innerHTML = '';
    Object.keys(entries).sort().reverse().forEach(date => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${date}</strong><br>${entries[date]}`;
      entryList.appendChild(li);
    });
  }
  
  window.onload = displayEntries;
  