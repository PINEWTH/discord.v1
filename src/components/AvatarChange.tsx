import React, { useState, useRef } from 'react';
import { X, AlertCircle, Upload, Link, Grid } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop',
];

interface AvatarChangeProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
  onClose: () => void;
}

type AvatarMode = 'preset' | 'url' | 'upload';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function AvatarChange({ currentAvatar, onAvatarChange, onClose }: AvatarChangeProps) {
  const [mode, setMode] = useState<AvatarMode>('preset');
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customUrl, setCustomUrl] = useState('');
  const [isPreviewError, setIsPreviewError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const avatarToSave = mode === 'url' ? customUrl : selectedAvatar;
    if (avatarToSave && !isPreviewError) {
      onAvatarChange(avatarToSave);
      onClose();
    }
  };

  const handleImageError = () => {
    setIsPreviewError(true);
    setErrorMessage('Invalid image URL');
  };

  const handleImageLoad = () => {
    setIsPreviewError(false);
    setErrorMessage('');
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
    setIsPreviewError(false);
    setErrorMessage('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setIsPreviewError(true);
      setErrorMessage('File size must be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setIsPreviewError(true);
      setErrorMessage('Only JPG, PNG, and GIF files are allowed');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setSelectedAvatar(base64);
      setIsPreviewError(false);
      setErrorMessage('');
    } catch (error) {
      setIsPreviewError(true);
      setErrorMessage('Error processing image');
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const renderPreview = (src: string) => (
    <div className="relative">
      <div className="aspect-square w-32 mx-auto rounded-lg overflow-hidden bg-gray-700">
        <img
          src={src}
          alt="Avatar preview"
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
      {isPreviewError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg">
          <div className="text-center text-red-400">
            <AlertCircle className="mx-auto mb-2" size={24} />
            <span className="text-sm">{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Change Avatar</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('preset')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
              mode === 'preset'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Grid size={18} />
            <span>Presets</span>
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
              mode === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Link size={18} />
            <span>URL</span>
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
              mode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Upload size={18} />
            <span>Upload</span>
          </button>
        </div>
        
        <div className="mb-6">
          {mode === 'preset' && (
            <div className="grid grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-lg overflow-hidden aspect-square ${
                    selectedAvatar === avatar ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={avatar}
                    alt="Avatar option"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {mode === 'url' && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={handleCustomUrlChange}
                  placeholder="Enter image URL..."
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {customUrl && renderPreview(customUrl)}
            </div>
          )}

          {mode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 px-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors mb-4"
              >
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto mb-2" size={24} />
                  <p>Click to upload JPG, PNG, or GIF</p>
                  <p className="text-sm mt-1">Max size: 5MB</p>
                </div>
              </button>
              {selectedAvatar && mode === 'upload' && renderPreview(selectedAvatar)}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              (mode === 'url' && (!customUrl || isPreviewError)) ||
              (mode === 'upload' && (!selectedAvatar || isPreviewError))
            }
            className={`px-4 py-2 bg-blue-600 text-white rounded-md transition-colors ${
              ((mode === 'url' && (!customUrl || isPreviewError)) ||
                (mode === 'upload' && (!selectedAvatar || isPreviewError)))
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}