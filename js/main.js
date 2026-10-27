// ========== Mobile Menu ==========
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// ========== Set today's date on invoice ==========
const invDate = document.getElementById('inv-date');
if (invDate) {
  const today = new Date().toISOString().split('T')[0];
  invDate.value = today;
}

// ========== Invoice Line Items ==========
const lineItemsContainer = document.getElementById('line-items');
const addItemBtn = document.getElementById('add-item');

function createLineItem(desc = '', qty = 1, price = '') {
  const div = document.createElement('div');
  div.className = 'grid grid-cols-12 gap-2 items-center line-item';
  div.innerHTML = `
    <input type="text" placeholder="Description (e.g. Mechanical seal replacement)" value="${desc}"
      class="col-span-6 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none item-desc">
    <input type="number" placeholder="Qty" value="${qty}" min="1" step="1"
      class="col-span-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none item-qty">
    <input type="number" placeholder="Unit Price" value="${price}" min="0" step="0.01"
      class="col-span-3 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none item-price">
    <button type="button" class="col-span-1 text-red-500 hover:text-red-700 remove-item" title="Remove">
      <i class="fas fa-times"></i>
    </button>
  `;
  div.querySelector('.remove-item').addEventListener('click', () => {
    if (document.querySelectorAll('.line-item').length > 1) {
      div.remove();
    }
  });
  return div;
}

// Start with one empty line
if (lineItemsContainer) {
  lineItemsContainer.appendChild(createLineItem('Pump service / labour', 1, ''));
  lineItemsContainer.appendChild(createLineItem('Parts / components', 1, ''));
}

if (addItemBtn) {
  addItemBtn.addEventListener('click', () => {
    lineItemsContainer.appendChild(createLineItem());
  });
}

// ========== Invoice Preview & Print ==========
function getInvoiceData() {
  const items = [];
  document.querySelectorAll('.line-item').forEach(row => {
    const desc = row.querySelector('.item-desc').value.trim();
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    if (desc || qty || price) {
      items.push({ desc, qty, price, total: qty * price });
    }
  });

  const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const tax = subtotal * (taxRate / 100);
  const grandTotal = subtotal + tax;

  return {
    number: document.getElementById('inv-number').value || 'INV-XXXX',
    date: document.getElementById('inv-date').value || new Date().toISOString().split('T')[0],
    customer: document.getElementById('cust-name').value || 'Customer Name',
    address: document.getElementById('cust-address').value || '',
    notes: document.getElementById('inv-notes').value || '',
    items,
    taxRate,
    subtotal,
    tax,
    grandTotal
  };
}

function renderInvoicePreview(data) {
  const preview = document.getElementById('invoice-preview');
  if (!preview) return;

  const formatMoney = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let itemsHtml = data.items.map(item => `
    <tr class="border-b border-gray-100">
      <td class="py-2 pr-2 text-sm">${item.desc || '—'}</td>
      <td class="py-2 text-center text-sm">${item.qty}</td>
      <td class="py-2 text-right text-sm">${formatMoney(item.price)}</td>
      <td class="py-2 text-right text-sm font-medium">${formatMoney(item.total)}</td>
    </tr>
  `).join('');

  if (!itemsHtml) {
    itemsHtml = `<tr><td colspan="4" class="py-4 text-center text-gray-400 text-sm">No items added yet</td></tr>`;
  }

  preview.innerHTML = `
    <div class="invoice-preview">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="bg-blue-600 text-white p-1.5 rounded">
              <i class="fas fa-tint text-sm"></i>
            </div>
            <span class="font-bold text-lg text-blue-900">Rufus Pump Service</span>
          </div>
          <p class="text-xs text-gray-500">Licensed Pump Technicians • Lusaka • Licence No: ZA537</p>
          <p class="text-xs text-gray-500 mt-1">samuelkaumba23@gmail.com<br>0979 473 294 / 0767 468 267</p>
        </div>
        <div class="text-right">
          <h2 class="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p class="text-sm text-gray-600 mt-1"># ${data.number}</p>
          <p class="text-sm text-gray-600">Date: ${data.date}</p>
        </div>
      </div>

      <!-- Bill To -->
      <div class="mb-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bill To</p>
        <p class="font-semibold text-gray-800">${data.customer}</p>
        <p class="text-sm text-gray-600 whitespace-pre-line">${data.address}</p>
      </div>

      <!-- Table -->
      <table class="w-full mb-6">
        <thead>
          <tr class="border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-500 uppercase">
            <th class="py-2">Description</th>
            <th class="py-2 text-center">Qty</th>
            <th class="py-2 text-right">Unit Price</th>
            <th class="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="flex justify-end">
        <div class="w-48 space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal</span>
            <span>${formatMoney(data.subtotal)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tax (${data.taxRate}%)</span>
            <span>${formatMoney(data.tax)}</span>
          </div>
          <div class="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Total</span>
            <span>${formatMoney(data.grandTotal)}</span>
          </div>
        </div>
      </div>

      ${data.notes ? `
        <div class="mt-8 pt-4 border-t border-gray-200">
          <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Notes / Terms</p>
          <p class="text-sm text-gray-600">${data.notes}</p>
        </div>
      ` : ''}

      <div class="mt-10 text-center text-xs text-gray-400">
        Thank you for your business • Rufus Pump Service • Lusaka
      </div>
    </div>
  `;
}

const previewBtn = document.getElementById('preview-invoice');
const printBtn = document.getElementById('print-invoice');

if (previewBtn) {
  previewBtn.addEventListener('click', () => {
    const data = getInvoiceData();
    renderInvoicePreview(data);
  });
}

if (printBtn) {
  printBtn.addEventListener('click', () => {
    const data = getInvoiceData();
    renderInvoicePreview(data);

    // Create a clean print window
    const printContent = document.getElementById('invoice-preview').innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${data.number}</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <style>
          body { padding: 40px; font-family: system-ui, sans-serif; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  });
}

// ========== Form submissions (demo behaviour) ==========
function handleFormSubmit(formId, successMsg) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(successMsg + '\n\n(This is a demo site. In production this would send an email or save to a database.)');
    form.reset();
  });
}

handleFormSubmit('quick-form', 'Thank you! We have received your request and will call you back shortly.');
handleFormSubmit('remote-form', 'Remote support request submitted. We will contact you as soon as possible.');
handleFormSubmit('contact-form', 'Message sent successfully. We will get back to you soon.');
