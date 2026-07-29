import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Мок react-easy-crop
vi.mock('react-easy-crop', () => ({
  default: ({ image, onCropComplete }) => {
    if (image) {
      setTimeout(() => onCropComplete({}, { x: 0, y: 0, width: 100, height: 100 }), 0);
    }
    return <div data-testid="mock-cropper">Cropper</div>;
  },
}));

// Мок createObjectURL
URL.createObjectURL = vi.fn(() => 'blob:mock-url');
URL.revokeObjectURL = vi.fn();

describe('ImageCropModal', () => {
  let ImageCropModal;
  const defaultProps = {
    file: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    aspect: 16 / 10,
    onCrop: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // Динамический импорт после установки моков
    const mod = await import('../../pages/Cabinet/AnketEditorPage');
    ImageCropModal = mod.ImageCropModal;
  });

  it('рендерит заголовок и кнопки', () => {
    render(<ImageCropModal {...defaultProps} />);

    expect(screen.getByText('Кадрирование фото')).toBeInTheDocument();
    expect(screen.getByText('Применить')).toBeInTheDocument();
    expect(screen.getByText('Отмена')).toBeInTheDocument();
  });

  it('кнопка Применить не disabled по умолчанию', () => {
    render(<ImageCropModal {...defaultProps} />);
    expect(screen.getByText('Применить')).not.toBeDisabled();
  });

  it('кнопка Отмена вызывает onClose', async () => {
    const onClose = vi.fn();
    render(<ImageCropModal {...defaultProps} onClose={onClose} />);

    await userEvent.click(screen.getByText('Отмена'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('показывает saving overlay при нажатии Применить', async () => {
    const onCrop = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<ImageCropModal {...defaultProps} onCrop={onCrop} />);

    await userEvent.click(screen.getByText('Применить'));

    expect(screen.getByText('Сохранение...')).toBeInTheDocument();
  });

  it('кнопка Отмена disabled когда saving=true', async () => {
    const onCrop = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<ImageCropModal {...defaultProps} onCrop={onCrop} />);

    await userEvent.click(screen.getByText('Применить'));

    const cancelBtn = screen.getByText('Отмена');
    expect(cancelBtn).toBeDisabled();
  });

  it('вызывает onCrop при сохранении', async () => {
    const onCrop = vi.fn().mockResolvedValue(undefined);
    render(<ImageCropModal {...defaultProps} onCrop={onCrop} />);

    await userEvent.click(screen.getByText('Применить'));

    await waitFor(() => {
      expect(onCrop).toHaveBeenCalledTimes(1);
    });
  });

  it('вызывает onClose если blob не создан', async () => {
    const onCrop = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<ImageCropModal {...defaultProps} onCrop={onCrop} onClose={onClose} />);

    await userEvent.click(screen.getByText('Применить'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
