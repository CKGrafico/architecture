// DOM elements
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const architectureContent = document.getElementById('architectureContent');
const copyToast = document.getElementById('copyToast');

// Get architecture content from the page
function getArchitectureText() {
    return architectureContent.textContent || architectureContent.innerText || '';
}

// Download functionality
function downloadArchitectureFile() {
    try {
        // Get content from the page
        const content = getArchitectureText();
        
        // Create a blob with the content
        const blob = new Blob([content], { type: 'text/markdown' });
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element for download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'architecture.md';
        a.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL
        window.URL.revokeObjectURL(url);
        
        // Visual feedback
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
        </svg> Downloaded!`;
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
        }, 2000);
        
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
}

// Copy to clipboard functionality
async function copyToClipboard() {
    try {
        // Get content from the page
        const content = getArchitectureText();
        
        // Try using the modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(content);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = content;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        // Show toast notification
        showToast();
        
        // Visual feedback on button
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
        </svg> Copied!`;
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
        
    } catch (error) {
        console.error('Copy failed:', error);
        alert('Copy failed. Please try again or select the text manually.');
    }
}

// Show toast notification
function showToast() {
    copyToast.classList.add('show');
    
    setTimeout(() => {
        copyToast.classList.remove('show');
    }, 3000);
}



// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + D for download
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        downloadArchitectureFile();
    }
    
    // Ctrl/Cmd + C when not in text selection for copy
    if ((event.ctrlKey || event.metaKey) && event.key === 'c' && window.getSelection().toString() === '') {
        event.preventDefault();
        copyToClipboard();
    }
}

// Initialize the application
function init() {
    // Add event listeners
    downloadBtn.addEventListener('click', downloadArchitectureFile);
    copyBtn.addEventListener('click', copyToClipboard);
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Add loading state handling
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });
    
    // Add focus management for accessibility
    downloadBtn.addEventListener('focus', () => {
        downloadBtn.setAttribute('aria-describedby', 'download-help');
    });
    
    copyBtn.addEventListener('focus', () => {
        copyBtn.setAttribute('aria-describedby', 'copy-help');
    });
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
}); 