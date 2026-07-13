<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PomodoroSession extends Model
{
    protected $fillable = [
        'api_user_id', 'task_name', 'type', 'duration_minutes',
        'started_at', 'ended_at', 'completed',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'completed' => 'boolean',
    ];

}
