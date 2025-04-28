// Update the main index.html to include the OpenRouter API integration

// Add this script tag to the head section of index.html
document.addEventListener('DOMContentLoaded', function() {
    // Load the OpenRouter API script
    const script = document.createElement('script');
    script.src = 'openrouter_api.js';
    document.head.appendChild(script);
    
    // Wait for the script to load before initializing
    script.onload = function() {
        // Initialize the model options with data from OpenRouter API
        initializeModelOptions();
        
        // Update the apply AI changes function to use the actual API
        updateApplyAiFunction();
        
        // Update the generate variations function to use the actual API
        updateGenerateVariationsFunction();
        
        // Update the generate image function to use the actual API
        updateGenerateImageFunction();
    };
});

// Initialize model options
function initializeModelOptions() {
    if (typeof window.OpenRouterAPI === 'undefined' || !window.OpenRouterAPI.AVAILABLE_MODELS) {
        console.error('OpenRouter API not loaded properly');
        return;
    }
    
    const modelOptions = document.querySelector('.model-options');
    if (!modelOptions) return;
    
    // Clear existing options
    modelOptions.innerHTML = '';
    
    // Add options from the API
    window.OpenRouterAPI.AVAILABLE_MODELS.forEach(model => {
        const option = document.createElement('div');
        option.className = 'model-option';
        option.setAttribute('data-model', model.id);
        option.textContent = model.name;
        
        // Add tooltip with description
        option.title = `${model.provider}: ${model.description}`;
        
        // Set selected state if this is the current model
        if (model.id === selectedModel) {
            option.classList.add('selected');
        }
        
        // Add click event
        option.addEventListener('click', function() {
            document.querySelectorAll('.model-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.getAttribute('data-model');
            localStorage.setItem('selectedModel', selectedModel);
        });
        
        modelOptions.appendChild(option);
    });
}

// Update the apply AI changes function to use the actual API
function updateApplyAiFunction() {
    const applyAiButton = document.getElementById('apply-ai');
    if (!applyAiButton) return;
    
    // Replace the click event handler
    applyAiButton.removeEventListener('click', applyAiChanges);
    applyAiButton.addEventListener('click', applyAiChangesWithAPI);
}

// Apply AI changes using the actual OpenRouter API
async function applyAiChangesWithAPI() {
    if (!apiKey) {
        alert('Please save an OpenRouter API key first to use AI enhancement features.');
        return;
    }
    
    const currentContent = document.getElementById('custom-post-content').value;
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Show loading spinner
    loadingSpinner.style.display = 'inline-block';
    
    try {
        // Call the OpenRouter API to enhance the content
        const enhancedContent = await window.OpenRouterAPI.enhancePostContent(
            currentContent,
            selectedOption,
            selectedTone,
            currentPost.platform,
            selectedModel,
            apiKey
        );
        
        // Update the textarea with the enhanced content
        document.getElementById('custom-post-content').value = enhancedContent;
    } catch (error) {
        console.error('Error with AI enhancement:', error);
        alert(`Failed to enhance post: ${error.message}`);
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}

// Update the generate variations function to use the actual API
function updateGenerateVariationsFunction() {
    const generateVariationsButton = document.getElementById('generate-variations');
    if (!generateVariationsButton) return;
    
    // Replace the click event handler
    generateVariationsButton.removeEventListener('click', generateVariations);
    generateVariationsButton.addEventListener('click', generateVariationsWithAPI);
}

// Generate variations using the actual OpenRouter API
async function generateVariationsWithAPI() {
    if (!apiKey) {
        alert('Please save an OpenRouter API key first to use content variation features.');
        return;
    }
    
    const variationsCount = parseInt(document.getElementById('variations-count').value);
    const currentContent = document.getElementById('custom-post-content').value;
    const loadingSpinner = document.getElementById('variations-loading-spinner');
    
    // Show loading spinner
    loadingSpinner.style.display = 'inline-block';
    
    // Clear previous variations
    document.getElementById('variations-container').innerHTML = '';
    
    try {
        // Call the OpenRouter API to generate variations
        const variations = await window.OpenRouterAPI.generateContentVariations(
            currentContent,
            variationsCount,
            selectedModel,
            apiKey
        );
        
        const container = document.getElementById('variations-container');
        
        variations.forEach((variation, index) => {
            const variationCard = document.createElement('div');
            variationCard.className = 'variation-card';
            variationCard.innerHTML = `
                <div class="variation-content">${variation}</div>
                <div class="variation-footer">
                    <button class="btn btn-secondary use-variation-btn">Use This</button>
                </div>
            `;
            
            container.appendChild(variationCard);
            
            // Add event listener to use variation button
            variationCard.querySelector('.use-variation-btn').addEventListener('click', function() {
                document.getElementById('custom-post-content').value = variation;
                
                // Switch to text tab
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelector('.tab[data-tab="text-tab"]').classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                document.getElementById('text-tab').classList.add('active');
            });
        });
    } catch (error) {
        console.error('Error generating variations:', error);
        alert(`Failed to generate variations: ${error.message}`);
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}

// Update the generate image function to use the actual API
function updateGenerateImageFunction() {
    const generateImageButton = document.getElementById('generate-image');
    if (!generateImageButton) return;
    
    // Replace the click event handler
    generateImageButton.removeEventListener('click', generateImage);
    generateImageButton.addEventListener('click', generateImageWithAPI);
}

// Generate image using the actual OpenRouter API for prompt generation
async function generateImageWithAPI() {
    if (!apiKey) {
        alert('Please save an OpenRouter API key first to use image generation features.');
        return;
    }
    
    const imageStyle = document.getElementById('image-style').value;
    const imageRatio = document.getElementById('image-ratio').value;
    const currentContent = document.getElementById('custom-post-content').value;
    const loadingSpinner = document.getElementById('image-loading-spinner');
    
    // Show loading spinner
    loadingSpinner.style.display = 'inline-block';
    
    try {
        // Generate an optimized prompt for image generation using OpenRouter
        const imagePrompt = await window.OpenRouterAPI.generateImagePrompt(
            currentContent,
            imageStyle,
            imageRatio,
            selectedModel,
            apiKey
        );
        
        // In a real implementation, this would call an image generation API with the prompt
        // For this demo, we'll use placeholder images
        
        // Select a placeholder based on the image ratio
        let imageUrl;
        if (imageRatio === 'square') {
            imageUrl = 'https://placehold.co/600x600/e67e22/ffffff?text=EasyParle+Dental+Chatbot';
        } else if (imageRatio === 'portrait') {
            imageUrl = 'https://placehold.co/600x750/e67e22/ffffff?text=Dental+AI+Assistant';
        } else {
            imageUrl = 'https://placehold.co/800x450/e67e22/ffffff?text=24/7+Appointment+Booking';
        }
        
        // Update image preview
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = `
            <img src="${imageUrl}" alt="Generated image">
            <p style="margin-top: 10px; font-size: 12px; color: #666;">Generated with prompt: "${imagePrompt.substring(0, 100)}..."</p>
        `;
        
        // Enable download button
        document.getElementById('download-image').disabled = false;
        
        // Add download functionality
        document.getElementById('download-image').onclick = function() {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = `easyparle_image_${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    } catch (error) {
        console.error('Error with image generation:', error);
        alert(`Failed to generate image: ${error.message}`);
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}
