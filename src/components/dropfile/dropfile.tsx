import React, { useCallback, useRef } from 'react';

type ImageDropzoneProps = {
  files: File[];
  onChange: any;
};

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ files, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    onChange([...files, ...droppedFiles]);
  }, [files, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    onChange([...files, ...selectedFiles]);
  };

  const preventDefault = (e: React.DragEvent) => e.preventDefault();

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #aaa',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        <p>Arraste imagens aqui ou clique para selecionar</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={url}
                alt={`preview-${index}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                onLoad={() => URL.revokeObjectURL(url)}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageDropzone;
