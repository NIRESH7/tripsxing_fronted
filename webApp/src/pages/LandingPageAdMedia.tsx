import { useState } from 'react';
import { Upload, Input, Button, Card, message, Image, Typography } from 'antd';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { LandingPageMediaHelper } from '../hooks/GetHooks';
import { InboxOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useCurrentUserData } from '@/utils/state';
import { UserData } from '@/interfaces/interfaces';
import YouTube, { YouTubeProps } from 'react-youtube';

const { Dragger } = Upload;
const { Text } = Typography;

// Sortable item component
const SortableItem = ({ item, onDelete }: { item: any; onDelete?: (id: number) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id.toString(),
        transition: {
            duration: 350, // Longer, smoother transition
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)' // Custom easing function for more natural movement
        }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        margin: '8px 0',
        cursor: isDragging ? 'grabbing' : 'grab', // Change cursor when dragging
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 999 : 1,
        position: 'relative' as 'relative',
        transformOrigin: 'center', // Ensure transforms happen from center
        willChange: 'transform' // Optimize for animations
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(item.id);
        }
    };
    const opts: YouTubeProps['opts'] = {
        height: '200',
        width: '250',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }


    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                style={{
                    margin: '8px 0',
                    overflow: 'hidden',
                    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                    transform: isDragging ? 'scale(1.02)' : undefined, // Scale up slightly when dragging
                    border: isDragging ? '2px solid #1890ff' : undefined, // Add blue border when dragging
                    background: isDragging ? '#f0f7ff' : undefined, // Add light blue background when dragging
                }}
                hoverable
                actions={[item.type === 'image' && <EyeOutlined key="view" onClick={(e) => {
                    e.stopPropagation();
                    // Find the Image component and trigger its preview
                    const imageElement = document.getElementById(`image-${item.id}`);
                    if (imageElement) {
                        const previewButton = imageElement.querySelector('.ant-image-mask');
                        if (previewButton) {
                            (previewButton as HTMLElement).click();
                        }
                    }
                }} />,
                onDelete && <DeleteOutlined key="delete" onClick={handleDelete} />
                ].filter(Boolean)}
            >
                {item.type === 'image' ? (
                    <div
                        id={`image-${item.id}`}
                        style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                    >
                        <Image
                            src={item.url}
                            alt="media"
                            style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                            preview={{
                                mask: (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <EyeOutlined style={{ marginRight: '5px' }} /> Preview
                                    </div>
                                )
                            }}
                        />
                    </div>
                ) : (
                    <div style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <YouTube
                                // https://www.youtube.com/watch?v=PQ2WjtaPfXU
                                videoId={
                                    item.url.includes('youtube') ?
                                        item.url.split('v=')[1] :
                                        // https://youtu.be/iYl7A4WDuik?si=frb6dFYL7r3hbqpE
                                        item.url.split('/')[3]
                                }
                                opts={opts}
                                onReady={onPlayerReady}

                            />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

// Item component for drag overlay
const DragItem = ({ item }: { item: any }) => {
    return (
        <Card
            style={{
                margin: '8px 0',
                overflow: 'hidden',
                width: '250px',
                boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
                transform: 'rotate(2deg) scale(1.05)', // Slightly rotate and scale for better visual feedback
                opacity: 0.9, // Slightly transparent
                pointerEvents: 'none', // Prevent interaction with the overlay
                transition: 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)' // Smooth transition
            }}
        >
            {item.type === 'image' ? (
                <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <img
                        src={item.url}
                        alt="media"
                        style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                    />
                </div>
            ) : (
                <div style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Text ellipsis style={{ padding: '0 10px' }}>{item.url}</Text>
                    </div>
                </div>
            )}
        </Card>
    );
};

const LandingPageAdMedia = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);
    const { getMedia, createMedia, updateMedia, DeleteMedia } = LandingPageMediaHelper();
    const { data: mediaItems = [], isLoading } = getMedia;

    const UserID = useCurrentUserData((state) => (state as {
        CurrentUserData: UserData;
    }).CurrentUserData.id);

    // Configure sensors for drag detection with improved sensitivity
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 100, // Hold for 250ms to start dragging
                tolerance: 10, // Add tolerance for smoother activation
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id.toString());
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = mediaItems.findIndex(item => item.id.toString() === active.id);
        const newIndex = mediaItems.findIndex(item => item.id.toString() === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(mediaItems, oldIndex, newIndex);

            // Update sequence IDs
            const newSequenceIds = newItems.map((item, index) => ({
                id: item.id,
                sequenceId: index + 1
            }));

            updateMedia.mutate({
                ids: newSequenceIds.map(i => i.id),
                sequenceIds: newSequenceIds.map(i => i.sequenceId),
                userId: UserID
            });
        }
    };

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('userId', UserID.toString());

        try {
            await createMedia.mutateAsync(formData);
            message.success('Image uploaded successfully');
        } catch (error) {
            message.error('Failed to upload image');
        }
    };

    const handleVideoUrlSubmit = async () => {
        if (!videoUrl) return;

        try {
            await createMedia.mutateAsync({
                url: videoUrl,
                type: 'video',
                userId: UserID
            });
            setVideoUrl('');
            message.success('Video URL added successfully');
        } catch (error) {
            message.error('Failed to add video URL');
        }
    };

    const handleDeleteMedia = async (id: number) => {
        try {
            if (window.confirm('Are you sure you want to delete this media?')) {
                await DeleteMedia.mutateAsync({ id, userId: UserID });
                message.success('Media deleted successfully');
            } else {
                return;
            }
        } catch (error) {
            message.error('Failed to delete media');
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const activeItem = activeId ? mediaItems.find(item => item.id.toString() === activeId) : null;

    if (isLoading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2>Upload Images</h2>
                <Dragger
                    customRequest={({ file }) => handleImageUpload(file as File)}
                    showUploadList={false}
                    accept="image/*"
                    multiple
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Click or drag images to upload</p>
                </Dragger>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Add Video URL</h2>
                <Input.Group compact>
                    <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Enter video URL"
                    />
                    <Button type="primary" onClick={handleVideoUrlSubmit}>Add</Button>
                </Input.Group>
            </div>

            <h2>Media List</h2>
            {
                mediaItems.length === 0 && <div
                    className='text-center'
                >No media items found.</div>
            }
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[]} // Can add modifiers here if needed
                onDragCancel={handleDragCancel}
            >
                <SortableContext
                    items={mediaItems.map(item => item.id.toString())}
                    strategy={rectSortingStrategy}
                >
                    <div
                        className='
                            lg:grid-cols-6 
                            md:grid-cols-4
                            sm:grid-cols-2
                            grid-cols-1
                            grid 
                            gap-4
                        '
                    >
                        {mediaItems.map((item: any) => (
                            <SortableItem key={item.id} item={item} onDelete={handleDeleteMedia} />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay adjustScale={true} dropAnimation={{
                    duration: 300,
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
                }}>
                    {activeItem ? <DragItem item={activeItem} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default LandingPageAdMedia;
