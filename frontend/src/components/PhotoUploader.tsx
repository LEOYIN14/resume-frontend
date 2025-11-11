import React, { useState, useRef, useEffect } from 'react';
import { Upload, Modal, Button, message, Tooltip } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

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
  // 状态管理
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [cropSelection, setCropSelection] = useState({ x: 0, y: 0, width: 0, height: 0 }) // 裁剪区域
  const [isDragging, setIsDragging] = useState(false) // 是否正在拖拽
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }) // 拖拽起始位置
  
  // Refs
  const cropRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  // 常量定义
  const displaySize = { width: 120, height: 160 } // 显示尺寸
  const outputSize = { width: 400, height: 533 } // 输出尺寸，简历照片通常需要更高质量（约3:4比例）
  const aspectRatio = outputSize.width / outputSize.height // 保持3:4的宽高比

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
      setTempImage(imageUrl)
    }
    
    return false // 阻止自动上传
  }

  // 处理图片确认
  const handleImageConfirm = () => {
    if (!tempImage || !imageRef.current || !cropRef.current) return
    
    try {
      // 创建canvas进行高质量处理
      const canvas = document.createElement('canvas')
      canvas.width = outputSize.width
      canvas.height = outputSize.height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        message.error('浏览器不支持canvas')
        return
      }
      
      // 设置canvas质量
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high' // 使用高质量平滑
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          // 设置白色背景
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, outputSize.width, outputSize.height)
          
          // 获取裁剪区域和图片的实际尺寸关系
          const cropElement = cropRef.current
          const imgElement = imageRef.current
          
          if (!cropElement || !imgElement) {
            message.error('裁剪区域获取失败')
            return
          }
          
          // 计算容器和图片的尺寸关系
          const containerWidth = cropElement.clientWidth
          const containerHeight = cropElement.clientHeight
          
          // 计算图片的实际缩放比例
          const imgRatio = img.width / img.height
          const containerRatio = containerWidth / containerHeight
          
          let displayWidth, displayHeight, scale
          
          if (imgRatio > containerRatio) {
            // 图片更宽，按宽度缩放
            displayWidth = containerWidth
            displayHeight = containerWidth / imgRatio
            scale = displayWidth / img.width
          } else {
            // 图片更高，按高度缩放
            displayHeight = containerHeight
            displayWidth = containerHeight * imgRatio
            scale = displayHeight / img.height
          }
          
          // 计算图片在容器中的偏移量（居中显示）
          const imgOffsetX = (containerWidth - displayWidth) / 2
          const imgOffsetY = (containerHeight - displayHeight) / 2
          
          // 计算裁剪区域在原图上的实际位置和大小
          // 将裁剪框坐标转换为相对于原图的坐标
          const actualCropX = (cropSelection.x - imgOffsetX) / scale
          const actualCropY = (cropSelection.y - imgOffsetY) / scale
          const actualCropWidth = cropSelection.width / scale
          const actualCropHeight = cropSelection.height / scale
          
          // 确保裁剪区域在图片范围内
          const safeCropX = Math.max(0, Math.min(actualCropX, img.width - actualCropWidth))
          const safeCropY = Math.max(0, Math.min(actualCropY, img.height - actualCropHeight))
          
          // 绘制裁剪后的图片到目标尺寸
          ctx.drawImage(
            img,
            safeCropX, safeCropY, actualCropWidth, actualCropHeight, // 源图片区域
            0, 0, outputSize.width, outputSize.height // 目标canvas区域
          )
          
          // 获取图片数据URL，设置较高的质量参数
          const resultImage = canvas.toDataURL('image/png', 0.95)
          
          onChange(resultImage)
          message.success('照片上传成功')
          setTempImage(null)
          setCropSelection({ x: 0, y: 0, width: 0, height: 0 })
        } catch (error) {
          console.error('图片处理错误:', error)
          message.error('图片处理失败，请重试')
          setTempImage(null)
        }
      }
      
      img.onerror = () => {
        message.error('图片加载失败，请重试')
        setTempImage(null)
      }
      
      img.src = tempImage
    } catch (error) {
      console.error('处理过程错误:', error)
      message.error('处理过程发生错误')
      setTempImage(null)
    }
  }

  // 处理预览
  const handlePreview = () => {
    if (photo) {
      // 优先使用原始图片进行预览，如果没有则使用处理后的图片
      setPreviewImage(photo) // 目前仍使用处理后的图片，但可以扩展为使用原始图片
      setPreviewOpen(true)
    }
  }
  
  // 初始化裁剪区域
  useEffect(() => {
    if (tempImage && cropRef.current && imageRef.current) {
      const imgElement = imageRef.current
      const cropElement = cropRef.current
      
      // 等待图片加载完成
      const waitForImageLoad = () => {
        if (imgElement.complete) {
          // 计算裁剪框的大小 - 保持3:4比例
          const containerWidth = cropElement.clientWidth
          const containerHeight = cropElement.clientHeight
          
          // 根据容器尺寸和比例计算裁剪框大小
          let cropWidth, cropHeight
          if (containerWidth / aspectRatio <= containerHeight) {
            cropWidth = containerWidth
            cropHeight = containerWidth / aspectRatio
          } else {
            cropHeight = containerHeight
            cropWidth = containerHeight * aspectRatio
          }
          
          // 居中裁剪框
          const x = (containerWidth - cropWidth) / 2
          const y = (containerHeight - cropHeight) / 2
          
          setCropSelection({ x, y, width: cropWidth, height: cropHeight })
        } else {
          setTimeout(waitForImageLoad, 100)
        }
      }
      
      waitForImageLoad()
    }
  }, [tempImage, aspectRatio])
  
  // 处理裁剪框拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    // 直接在裁剪框上绑定的事件，不需要额外检查
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropSelection.x, y: e.clientY - cropSelection.y });
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropRef.current) return
    
    const cropElement = cropRef.current
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // 限制裁剪框在容器内
    const maxX = cropElement.clientWidth - cropSelection.width
    const maxY = cropElement.clientHeight - cropSelection.height
    
    setCropSelection(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    }))
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e as unknown as React.MouseEvent);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      }
    }
  }, [isDragging, dragStart, cropSelection])

  const uploadProps: UploadProps = {
    beforeUpload,
    showUploadList: false,
  }

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      {/* 照片显示区域 */}
      <div 
        style={{
          width: displaySize.width,
          height: displaySize.height,
          border: '1px solid #d9d9d9',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#f5f5f5'
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
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <PlusOutlined style={{ fontSize: 40, color: '#3498db', lineHeight: 1, display: 'block', marginBottom: '8px' }} />
            <div style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>点击上传照片</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>支持JPG、PNG格式</div>
          </div>
        )}
        
        {/* 未上传照片时，整个区域作为上传按钮 */}
        {!photo && (
          <Upload {...uploadProps}>
            <Tooltip title="点击上传照片">
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
            </Tooltip>
          </Upload>
        )}
        
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
        
        {/* 当有照片时，底部区域作为预览按钮 */}
        {photo && (
          <Tooltip title="点击预览照片">
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '4px 5px',
                fontSize: 12,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 15
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePreview();
              }}
            >
              点击预览照片
            </div>
          </Tooltip>
        )}
        
        {/* 当有照片时，在右上角添加一个小的上传按钮 */}
        {photo && (
          <Upload {...uploadProps}>
            <Tooltip title="更换照片">
              <div
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  backgroundColor: 'rgba(0,128,255,0.7)',
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
              >
                <UploadOutlined style={{ fontSize: 12 }} />
              </div>
            </Tooltip>
          </Upload>
        )}
      </div>

      {/* 图片确认对话框 */}
      <Modal
        title="裁剪照片"
        open={!!tempImage}
        onCancel={() => setTempImage(null)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setTempImage(null)}
            style={{
              padding: '6px 16px',
              fontSize: '14px',
              borderRadius: '6px'
            }}
          >
            取消
          </Button>,
          <Button 
            key="ok" 
            type="primary" 
            onClick={handleImageConfirm}
            style={{
              padding: '6px 16px',
              fontSize: '14px',
              borderRadius: '6px'
            }}
          >
            确认裁剪并上传
          </Button>
        ]}
        width={600}
      >
        <div 
          ref={cropRef}
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: 400, 
            overflow: 'hidden',
            border: '1px solid #d9d9d9',
            backgroundColor: '#f0f0f0',
            cursor: 'default' // 改为默认鼠标样式
          }}
          // 移除onMouseDown，因为现在只在裁剪框上绑定拖动事件
        >
          {/* 半透明遮罩 */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            clipPath: `polygon(
              0 0, 0 100%, ${cropSelection.x}px 100%, 
              ${cropSelection.x}px ${cropSelection.y}px, 
              ${cropSelection.x + cropSelection.width}px ${cropSelection.y}px, 
              ${cropSelection.x + cropSelection.width}px ${cropSelection.y + cropSelection.height}px, 
              ${cropSelection.x}px ${cropSelection.y + cropSelection.height}px, 
              ${cropSelection.x}px 100%, 100% 100%, 100% 0
            )`
          }} />
          
          {/* 裁剪框 - 可拖动区域 */}
          <div 
            style={{
              position: 'absolute',
              left: cropSelection.x,
              top: cropSelection.y,
              width: cropSelection.width,
              height: cropSelection.height,
              border: '2px dashed #fff',
              boxSizing: 'border-box',
              cursor: isDragging ? 'grabbing' : 'move',
              backgroundColor: 'transparent',
              zIndex: 2,
              // 添加半透明背景增强视觉效果
              background: 'rgba(255, 255, 255, 0.1)',
              // 添加四角标记
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.5)'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* 拖动提示 */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: '#fff',
              fontSize: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '3px 8px',
              borderRadius: 4
            }}>
              拖动此框调整裁剪区域
            </div>
          </div>
          
          {/* 图片 */}
          {tempImage && (
              <img 
                ref={imageRef}
                src={tempImage} 
                alt="裁剪预览" 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  zIndex: 1
                }}
                onLoad={() => {
                  // 图片加载完成后重新计算裁剪区域
                  if (imageRef.current && cropRef.current) {
                    const containerWidth = cropRef.current.clientWidth;
                    const containerHeight = cropRef.current.clientHeight;
                    
                    // 根据容器尺寸和比例计算裁剪框大小
                    let cropWidth, cropHeight;
                    if (containerWidth / aspectRatio <= containerHeight) {
                      cropWidth = containerWidth;
                      cropHeight = containerWidth / aspectRatio;
                    } else {
                      cropHeight = containerHeight;
                      cropWidth = containerHeight * aspectRatio;
                    }
                    
                    // 居中裁剪框
                    const x = (containerWidth - cropWidth) / 2;
                    const y = (containerHeight - cropHeight) / 2;
                    
                    setCropSelection({ x, y, width: cropWidth, height: cropHeight });
                  }
                }}
              />
          )}
        </div>
        
        <div style={{ 
          marginTop: 16, 
          fontSize: 14, 
          color: '#666',
          textAlign: 'center'
        }}>
          <p>拖动裁剪框选择需要的部分</p>
          <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
            简历照片尺寸: {outputSize.width} x {outputSize.height} 像素 (3:4比例)
          </p>
        </div>
      </Modal>

      {/* 预览对话框 */}
      <Modal
        title="照片预览"
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={600} // 增加预览窗口宽度
      >
        <div style={{ textAlign: 'center' }}>
          <img 
            alt="预览" 
            style={{ 
              maxWidth: '100%',
              maxHeight: 500,
              margin: '0 auto',
              display: 'block',
              border: '1px solid #d9d9d9',
              padding: 5,
              backgroundColor: '#fff'
            }} 
            src={previewImage} 
          />
          <div style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
            简历照片尺寸: {outputSize.width} x {outputSize.height} 像素
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PhotoUploader