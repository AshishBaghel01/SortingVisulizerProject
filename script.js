const barsContainer = document.getElementById('barsContainer');
const sizeInput = document.getElementById('arraySize');
const startBtn = document.getElementById('startBtn');
const speedSlider = document.getElementById('speedSlider');
const algorithmSelect = document.getElementById('algorithm');
const darkToggle = document.getElementById('darkToggle');

let array = [];

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

function createArray(size) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  renderBars(array);
}

function renderBars(arr, highlight = []) {
  barsContainer.innerHTML = '';
  arr.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value * 4}px`;
    bar.textContent = value;
    if (highlight.includes(i)) bar.style.backgroundColor = 'red';
    barsContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mergeSort(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return;

  const mid = Math.floor((l + r) / 2);
  await mergeSort(arr, l, mid);
  await mergeSort(arr, mid + 1, r);
  await merge(arr, l, mid, r);
}

async function merge(arr, l, mid, r) {
  const left = arr.slice(l, mid + 1);
  const right = arr.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    renderBars(array, [k - 1]);
    await sleep(speedSlider.value);
  }

  while (i < left.length) {
    arr[k++] = left[i++];
    renderBars(array, [k - 1]);
    await sleep(speedSlider.value);
  }

  while (j < right.length) {
    arr[k++] = right[j++];
    renderBars(array, [k - 1]);
    await sleep(speedSlider.value);
  }
}

async function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
      renderBars(arr, [i, j, minIdx]);
      await sleep(speedSlider.value);
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    renderBars(arr, [i, minIdx]);
    await sleep(speedSlider.value);
  }
}

async function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      renderBars(arr, [j + 1, i]);
      await sleep(speedSlider.value);
    }
    arr[j + 1] = key;
    renderBars(arr, [j + 1]);
    await sleep(speedSlider.value);
  }
}

async function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;

  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    renderBars(arr, [i, largest]);
    await sleep(speedSlider.value);
    await heapify(arr, n, largest);
  }
}

async function heapSort(arr) {
  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    renderBars(arr, [0, i]);
    await sleep(speedSlider.value);
    await heapify(arr, i, 0);
  }
}

// Main button
startBtn.addEventListener('click', async () => {
  createArray(+sizeInput.value);
  await sleep(300);

  switch (algorithmSelect.value) {
    case 'mergeSort':
      await mergeSort(array);
      break;
    case 'selectionSort':
      await selectionSort(array);
      break;
    case 'insertionSort':
      await insertionSort(array);
      break;
    case 'heapSort':
      await heapSort(array);
      break;
  }
});

createArray(+sizeInput.value);
