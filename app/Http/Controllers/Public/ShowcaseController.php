<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\BacksoundService;
use App\Services\CategoryService;
use Inertia\Inertia;
use Inertia\Response;

class ShowcaseController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
        protected BacksoundService $backsoundService
    ) {}

    public function index(): Response
    {
        $categories = $this->categoryService->getActiveForShowcase();
        $backsounds = $this->backsoundService->getActive();

        // Group backsounds by context for easy frontend playback
        $generalBacksounds = $backsounds->where('context', 'general')->values();
        $nomineeBacksounds = $backsounds->where('context', 'nominee_display')->values();
        $suspenseBacksounds = $backsounds->where('context', 'suspense')->values();
        $winnerBacksounds = $backsounds->where('context', 'winner_reveal')->values();
        $loopBacksounds = $backsounds->where('context', 'background_loop')->values();

        $settings = [
            'event_title' => Setting::get('event_title', 'Employee Award 2026'),
            'event_subtitle' => Setting::get('event_subtitle', 'Malam Penganugerahan & Apresiasi Insan Berprestasi'),
            'slide_duration' => (int) Setting::get('slide_duration', 8), // seconds per nominee slide
            'suspense_duration' => (int) Setting::get('suspense_duration', 4), // seconds for "And the winner is..."
            'reveal_duration' => (int) Setting::get('reveal_duration', 10), // seconds for winner celebration
            'auto_loop' => filter_var(Setting::get('auto_loop', true), FILTER_VALIDATE_BOOLEAN),
        ];

        return Inertia::render('Public/Showcase', [
            'categories' => $categories,
            'backsounds' => [
                'general' => $generalBacksounds,
                'nominee' => $nomineeBacksounds,
                'nominee_display' => $nomineeBacksounds,
                'suspense' => $suspenseBacksounds,
                'winner' => $winnerBacksounds,
                'winner_reveal' => $winnerBacksounds,
                'loop' => $loopBacksounds,
                'background_loop' => $loopBacksounds,
                'all' => $backsounds->values(),
            ],
            'settings' => $settings,
        ]);
    }
}
