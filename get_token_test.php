<?php
echo \App\Models\User::first()->createToken('test')->plainTextToken;
