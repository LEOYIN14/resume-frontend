import React, { useState, useRef } from 'react'
import { Upload, Modal, Slider, Button, message } from 'antd'
import type { UploadProps } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'

interface PhotoUploaderProps {
  photo: string
  onChange: (photo: string) => void
  maxSize?: number // 最大文件大小，单位MB
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  photo, 
  onChange, 
  maxSize = 10 
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [croppingImage, setCroppingImage] = useState<string | null>(null)
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(100)
  const cropperRef = useRef<HTMLDivElement>(null)
  const maxWidth = 120
  const maxHeight = 160

  // 验证文件
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 图片!')
      return Upload.LIST_IGNORE
    }
    
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB!`)
      return Upload.LIST_IGNORE
    }
    
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setCroppingImage(imageUrl)
      setCropPosition({ x: 0, y: 0 })
      setZoom(100)
    }
    
    return false // 阻止自动上传
  }

  // 处理裁剪完成
  const handleCropComplete = () => {
    if (!croppingImage || !cropperRef.current) return
    
    // 创建canvas进行裁剪
    const canvas = document.createElement('canvas')
    canvas.width = maxWidth
    canvas.height = maxHeight
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    img.onload = () => {
      // 计算实际缩放比例
      const actualZoom = zoom / 100
      const scaledWidth = img.width * actualZoom
      const scaledHeight = img.height * actualZoom
      
      // 计算裁剪位置（居中裁剪）
      const cropX = Math.max(0, cropPosition.x)
      const cropY = Math.max(0, cropPosition.y)
      
      // 确保裁剪区域不超出图片边界
      const finalCropX = Math.min(cropX, scaledWidth - maxWidth)
      const finalCropY = Math.min(cropY, scaledHeight - maxHeight)
      
      // 绘制裁剪后的图像
      ctx?.drawImage(
        img, 
        finalCropX / actualZoom, 
        finalCropY / actualZoom, 
        maxWidth / actualZoom, 
        maxHeight / actualZoom, 
        0, 
        0, 
        maxWidth, 
        maxHeight
      )
      
      // 获取裁剪后的图片数据URL
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9)
      onChange(croppedImage)
      message.success('照片上传成功')
      setCroppingImage(null)
    }
    img.src = croppingImage
  }

  // 处理预览
  const handlePreview = () => {
    if (photo) {
      setPreviewImage(photo)
      setPreviewOpen(true)
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload,
    showUploadList: false,
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* 照片显示区域 - 确保加号图标明显且可点击 */}
      <div 
        style={{
          width: maxWidth,
          height: maxHeight,
          border: '1px solid #d9d9d9',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#f5f5f5',
          cursor: 'pointer'
        }}
      >
        {photo ? (
          <img 
            src={photo} 
            alt="头像" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, color: '#999', lineHeight: 1 }}>+</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 5 }}>添加照片</div>
          </div>
        )}
        
        {/* 覆盖整个区域的上传按钮，使点击任何位置都能触发上传 */}
        <Upload {...uploadProps}>
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              zIndex: 10
            }}
          />
        </Upload>
        
        {/* 当有照片时，添加删除按钮 */}
        {photo && (
          <div
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              message.success('照片已删除');
            }}
            title="删除照片"
          >
            <DeleteOutlined style={{ fontSize: 12 }} />
          </div>
        )}
        
        {/* 点击有照片的区域可以预览 */}
        {photo && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: '2px 5px',
              fontSize: 11,
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={handlePreview}
          >
            点击预览
          </div>
        )}
      </div>

      {/* 裁剪对话框 */}
      <Modal
        title="裁剪照片"
        open={!!croppingImage}
        onCancel={() => setCroppingImage(null)}
        footer={[
          <Button key="cancel" onClick={() => setCroppingImage(null)}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleCropComplete}>
            确定
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>缩放: {zoom}%</div>
          <Slider 
            min={50} 
            max={200} 
            value={zoom} 
            onChange={setZoom} 
          />
        </div>
        
        <div 
          style={{
            width: '100%',
            height: 300,
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #d9d9d9'
          }}
        >
          {croppingImage && (
            <div
              ref={cropperRef}
              style={{
                position: 'absolute',
                transform: `translate(${cropPosition.x}px, ${cropPosition.y}px)`,
                cursor: 'move'
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                const startX = e.clientX - cropPosition.x
                const startY = e.clientY - cropPosition.y
                
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  setCropPosition({
                    x: moveEvent.clientX - startX,
                    y: moveEvent.clientY - startY
                  })
                }
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }
                
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            >
              <img 
                src={croppingImage} 
                alt="裁剪预览" 
                style={{
                  width: `${zoom}%`,
                  height: 'auto',
                  transition: 'transform 0.1s ease'
                }} 
              />
            </div>
          )}
          
          {/* 裁剪框指示器 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: maxWidth,
              height: maxHeight,
              border: '2px dashed #3498db',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        </div>
        
        <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          拖拽图片调整位置，使用滑块控制缩放，红色虚线框内的区域将被保留
        </div>
      </Modal>

      {/* 预览对话框 */}
      <Modal
        title="照片预览"
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img 
          alt="预览" 
          style={{ 
            width: '100%',
            maxWidth: 300,
            margin: '0 auto',
            display: 'block'
          }} 
          src={previewImage} 
        />
      </Modal>
    </div>
  )
}

export default PhotoUploader